import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import DocumentView from "./DocumentScreens/DocumentView";
import UploadDocument from "./DocumentScreens/UploadDocument";
import { useEffect, useState } from "react";
import firebase, { auth } from "../../../firebaseConfig";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";
import DocView from "./DocumentScreens/DocView";
import ReferencedDoc from "./DocumentScreens/ReferencedDoc";
import DocChat from "./DocumentScreens/DocChat";
import useRevenueCat from "../../../hooks/useRevenueCat";

const Stack = createStackNavigator();

export default function Documents({ tokens, setTokens }) {
	const [docsArr, setDocsArr] = useState([]);
	const [selectedDoc, setSelectedDoc] = useState();
	const [loading, setLoading] = useState(false);

	const userRef = firebase.firestore().collection("users");
	const user = auth.currentUser;

	const navigation = useNavigation();

	const { isProMember } = useRevenueCat();

	function openDoc(docName, docContent, docId, docAllChats, referencedDoc) {
		setSelectedDoc({
			name: docName,
			content: docContent,
			id: docId,
			allChats: docAllChats,
			referencedDoc,
		});
		navigation.navigate("DocView");
	}

	function uploadDocument(docName, docContent) {
		const arr = docsArr;
		const id = uuid.v4();
		arr.unshift({
			id,
			name: docName,
			content: docContent,
			referencedDoc: "",
			allChats: [
				{
					sender: "ai",
					message:
						"Hey! Feel free to ask me any question about your document and I'll do my best to answer you",
				},
			],
		});

		if (!isProMember) {
			userRef.doc(user.uid).update({
				smartDocs: arr,
				tokens: tokens - 3,
			});

			setTokens(tokens - 3);
		}

		setDocsArr(arr);

		return id;
	}

	function saveDoc(referencedDoc) {
		docsArr.forEach((doc, i) => {
			if (doc.id == selectedDoc.id) {
				const arr = docsArr;

				arr.splice(i, 1, {
					...selectedDoc,
					referencedDoc,
				});

				userRef.doc(user.uid).update({
					smartDocs: arr,
				});

				setDocsArr(arr);
				setSelectedDoc({ ...selectedDoc, referencedDoc });
			}
		});
	}

	function saveChat(allChats) {
		docsArr.forEach((doc, i) => {
			if (doc.id == selectedDoc.id) {
				const arr = docsArr;

				console.log(selectedDoc);
				console.log(allChats);
				console.log({
					selectedDoc,
					allChats,
				});

				arr.splice(i, 1, {
					...selectedDoc,
					allChats,
				});

				userRef.doc(user.uid).update({
					smartDocs: arr,
				});

				setDocsArr(arr);
				setSelectedDoc({ ...selectedDoc, allChats });
			}
		});
	}

	function deleteDoc(id) {
		docsArr.forEach((doc, i) => {
			if (doc.id == id) {
				const arr = docsArr;
				arr.splice(i, 1);

				userRef.doc(user.uid).update({
					smartDocs: arr,
				});

				setDocsArr(arr);
			}
		});
	}

	useEffect(() => {
		userRef.onSnapshot((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (doc.id === user.uid) {
					setDocsArr(doc.data().smartDocs || []);
				}
			});
		});
	}, []);

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				cardStyle: {
					backgroundColor: "#FFF",
				},
			}}
		>
			<Stack.Screen name="View">
				{() => {
					return (
						<DocumentView
							deleteDoc={deleteDoc}
							docsArr={docsArr}
							openDoc={openDoc}
						/>
					);
				}}
			</Stack.Screen>
			<Stack.Screen name="Upload" options={{ presentation: "modal" }}>
				{() => {
					return (
						<UploadDocument uploadDocument={uploadDocument} tokens={tokens} />
					);
				}}
			</Stack.Screen>
			<Stack.Screen name="DocView" options={{ gestureEnabled: !loading }}>
				{() => {
					return (
						<DocView
							selectedDoc={selectedDoc}
							saveDoc={saveDoc}
							setLoading={setLoading}
							loading={loading}
						/>
					);
				}}
			</Stack.Screen>
			<Stack.Screen name="Reference" options={{ gestureEnabled: !loading }}>
				{() => {
					return <ReferencedDoc selectedDoc={selectedDoc} loading={loading} />;
				}}
			</Stack.Screen>
			<Stack.Screen name="Chat">
				{() => {
					return (
						<DocChat
							saveChat={saveChat}
							content={selectedDoc.content}
							docAllChats={selectedDoc.allChats}
						/>
					);
				}}
			</Stack.Screen>
		</Stack.Navigator>
	);
}
