import { Text, View, Pressable, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../Header";
import {
	MaterialIcons,
	AntDesign,
	Feather,
	Ionicons,
	FontAwesome,
} from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import { auth } from "../../../../firebaseConfig";

import {
	ref,
	getDownloadURL,
	uploadBytesResumable,
	listAll,
} from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import LoadingCard from "../../LoadingCard";
import { useNavigation } from "@react-navigation/native";
import Doc from "./DocumentViewComponents/Doc";

export default function DocumentView({ docsArr, openDoc, deleteDoc, tokens }) {
	const [isUploading, setIsUploading] = useState(false);
	const [documents, setDocuments] = useState([]);

	const navigation = useNavigation();

	function handleAddDoc() {
		DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true }).then(
			async (res) => {
				const response = await fetch(res.uri);
				const blob = await response.blob();
				setIsUploading(true);
				UploadFile(blob, res.name);
			}
		);
	}

	function listDocs() {
		const listRef = ref(storage, `userDocs/${auth.currentUser.uid}`);

		listAll(listRef).then((res) => {
			setDocuments(res.items);
		});
	}

	useEffect(() => {
		console.log(auth.currentUser.uid);

		listDocs();
	}, []);

	function UploadFile(blobFile, fileName, isUploadCompleted) {
		const storageRef = ref(
			storage,
			`userDocs/${auth.currentUser.uid}/${fileName}`
		);
		const uploadTask = uploadBytesResumable(storageRef, blobFile);
		uploadTask.on(
			"state_changed",
			null,
			(error) => console.log(error),
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log("File available at", downloadURL);
					setIsUploading(false);
					return downloadURL;
				});

				listDocs();
			}
		);
	}

	return (
		<ScrollView>
			<SafeAreaView style={styles.page}>
				<Header
					heading={"Smart Documents"}
					icon1={
						<Pressable
							style={styles.headerBtns}
							onPress={() => navigation.navigate("Upload")}
							// navigation.navigate("Create")
						>
							<Feather name="plus" size={26} color="#494156" />
						</Pressable>
					}
					// icon2={
					// 	<Pressable
					// 		onPress={() => navigation.navigate("Paywall")}
					// 		// style={styles.userAvatar}
					// 		style={{
					// 			...styles.userTokens,
					// 			backgroundColor: "#ECEAF8",
					// 			paddingVertical: 7,
					// 			paddingHorizontal: 10,
					// 			borderRadius: 10,
					// 		}}
					// 	>
					// 		<FontAwesome
					// 			name="ticket"
					// 			size={24}
					// 			color="#F86968"
					// 			style={{ marginRight: 10 }}
					// 		/>
					// 		<Text style={{ fontSize: 16, fontWeight: "500" }}>{tokens}</Text>
					// 		{/* <MaterialIcons name="logout" size={26} color="black" /> */}
					// 		{/* <MaterialIcons name="account-circle" size={32} color="black" /> */}
					// 	</Pressable>
					// }
				/>

				{docsArr?.length ? (
					<View style={styles.documentsWrapper}>
						{docsArr.map((doc, i) => {
							return (
								<Doc
									key={i}
									docName={doc.name}
									docContent={doc.content}
									referencedDoc={doc.referencedDoc}
									paraphrasedDoc={doc.paraphrasedDoc}
									improvedWork={doc.improvedWork}
									docId={doc.id}
									openDoc={openDoc}
									deleteDoc={deleteDoc}
									docAllChats={doc.allChats}
								/>
							);
						})}
					</View>
				) : (
					<View>
						<View style={styles.smartDocExplanationWrapper}>
							<Text style={styles.heading}>What Are Smart Documents?</Text>

							<Text style={styles.subheading}>
								Turn any of your work into a smart document, so that you can:
							</Text>

							<View style={styles.listElement}>
								{/* <AntDesign
									name="checkcircleo"
									size={18}
									color="black"
									style={styles.listIcon}
								/> */}
								<Text>Automatically add references to your work</Text>
							</View>

							<View style={styles.listElement}>
								{/* <AntDesign
									name="checkcircleo"
									size={18}
									color="black"
									style={styles.listIcon}
								/> */}
								<Text>
									Ask your document any questions, and get answers from the
									document's content
								</Text>
							</View>

							<View style={styles.listElement}>
								{/* <AntDesign
									name="checkcircleo"
									size={18}
									color="black"
									style={styles.listIcon}
								/> */}
								<Text>Summarize a document</Text>
							</View>

							<View style={styles.listElement}>
								{/* <AntDesign
									name="checkcircleo"
									size={18}
									color="black"
									style={styles.listIcon}
								/> */}
								<Text>Paraphrase your document</Text>
							</View>
						</View>

						<Pressable
							style={styles.button}
							onPress={() => navigation.navigate("Upload")}
						>
							<Text style={styles.buttonText}>Get Started</Text>
						</Pressable>
					</View>
				)}

				{/* <View style={styles.documentsWrapper}>
					{documents.map((item, index) => {
						const docName = item["_location"]["path_"].split("/")[2];
						return (
							<Pressable
								style={styles.docWrapper}
								key={index}
								onPress={() =>
									getDownloadURL(
										ref(storage, `userDocs/${auth.currentUser.uid}/${docName}`)
									).then((url) => console.log(url))
								}
							>
								<View style={styles.docImageWrapper}>
									<Image
										style={styles.docImage}
										source={require("../../../assets/docxIcon.png")}
									/>
								</View>
								<Text numberOfLines={1} style={styles.docName}>
									{docName}
								</Text>
							</Pressable>
						);
					})}
				</View> */}
			</SafeAreaView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	userTokens: {
		flexDirection: "row",
		alignItems: "center",
	},
	page: {
		marginTop: 40,
		paddingHorizontal: 30,
		width: "100%",
		height: "100%",
	},
	documentInput: {
		backgroundColor: "rgba(0, 0, 0, .04)",
		fontSize: 16,
		fontWeight: "600",
		borderRadius: 10,
		marginBottom: 25,
		padding: 20,
	},
	button: {
		backgroundColor: "#FC6B68",
		width: "100%",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 20,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "700",
	},
	smartDocExplanationWrapper: {
		backgroundColor: "#E2E9F3",
		padding: 30,
		borderRadius: 20,
		opacity: 0.5,
	},
	heading: {
		textAlign: "center",
		fontWeight: "600",
		fontSize: 18,
		marginBottom: 20,
	},
	subheading: {
		marginBottom: 15,
	},
	listElement: {
		flexDirection: "row",
		marginBottom: 15,
		// flexWrap: "wrap",
	},
	listIcon: {
		marginRight: 15,
	},
	documentsWrapper: {
		width: "100%",
		flex: 3,
		flexDirection: "row",
		flexWrap: "wrap",
	},
	docWrapper: {
		width: "30%",
		marginRight: 10,
	},
	docImageWrapper: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "rgba(0, 0, 0, .3)",
		padding: 20,
		marginBottom: 10,
	},
	docImage: {
		width: "100%",
		height: undefined,
		aspectRatio: 0.95,
	},
	docName: {
		textAlign: "center",
	},
});
