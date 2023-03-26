import {
	View,
	Text,
	Pressable,
	StyleSheet,
	TextInput,
	Keyboard,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import LoadingCard from "../../LoadingCard";

import { auth, db } from "../../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import firebase from "../../../../firebaseConfig";
import useRevenueCat from "../../../../hooks/useRevenueCat";

export default function NoteQuetions({ questions, content, title, saveNote }) {
	const [noteQuestions, setNoteQuestions] = useState(questions);
	const [isLoading, setIsLoading] = useState(false);

	const apiKey = "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";
	const apiUrl = "https://api.openai.com/v1/completions";

	const navigation = useNavigation();

	const userRef = doc(db, "users", auth.currentUser.uid);
	const usersCollection = firebase.firestore().collection("users");

	const { isProMember } = useRevenueCat();

	const handleClick = async (notes) => {
		const userSnap = await getDoc(userRef);

		if (userSnap.data().dailyQuestions < 2 || isProMember) {
			setIsLoading(true);
			Keyboard.dismiss();

			const createErrorAlert = () =>
				Alert.alert("Oh oh!", "Something went wrong. Please try again.", [
					{ text: "OK" },
				]);

			if (notes.length < 100) {
				setIsLoading(false);

				const createTwoButtonAlert = () =>
					Alert.alert(
						"Failed to generate questions",
						"Your notes must be at least 100 characters long to generate questions from them",
						[{ text: "OK" }]
					);

				createTwoButtonAlert();
			} else {
				const prompt = `Generate 5 questions from the following notes, in the format QUESTION (new line) ANSWER: . Next to the question, give a reasonable mark for the answer hinting at how many points must be included. Answers must vary in length and detail and in marks awarded. Here are the notes to make questions from: ${notes}`;
				const response = await axios
					.post(
						apiUrl,
						{
							model: "text-davinci-003",
							prompt,
							max_tokens: 1024,
							temperature: 0.5,
						},
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${apiKey}`,
							},
						}
					)
					.catch((e) => {
						console.log(e);
						createErrorAlert();
					});

				const text = response.data.choices[0].text.trim();

				setNoteQuestions(
					`${noteQuestions && noteQuestions + "\n-----\n "}${text}`
				);
				usersCollection.doc(auth.currentUser.uid).update({
					dailyQuestions: userSnap.data().dailyQuestions + 1,
				});
				setIsLoading(false);
			}
		} else {
			navigation.navigate("Paywall");
		}
	};

	return (
		<Pressable onPress={() => Keyboard.dismiss()}>
			<View style={{ height: "100%" }}>
				<SafeAreaView style={styles.page}>
					<View style={styles.pageHeading}>
						<Pressable onPress={navigation.goBack}>
							<AntDesign name="closecircleo" size={25} color="#FC6B68" />
						</Pressable>
						<Text style={[styles.header, styles.header2]}>Questions</Text>
						<Pressable
							onPress={() => {
								saveNote(noteQuestions);
								navigation.goBack();
							}}
						>
							<AntDesign name="checkcircleo" size={25} color="#FC6B68" />
						</Pressable>
					</View>

					<ScrollView automaticallyAdjustKeyboardInsets={true}>
						<View style={styles.editingHeading}>
							<Text style={styles.editingTitle}>{title}</Text>
						</View>

						<TextInput
							style={styles.editingContent}
							multiline={true}
							defaultValue={noteQuestions}
							onChangeText={(newQuestions) => setNoteQuestions(newQuestions)}
							placeholder="Start writing questions..."
						/>
					</ScrollView>

					<View style={styles.btnsContainer}>
						<Pressable
							style={styles.scanBtn}
							onPress={() => handleClick(content)}
						>
							<AntDesign name="book" size={24} color="white" />
						</Pressable>
					</View>
				</SafeAreaView>
				<LoadingCard
					loadingText="Generating questions"
					isLoading={isLoading}
					width="59%"
				/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		flex: 1,
		top: 0,
		left: 0,
		backgroundColor: "rgba(0, 0, 0, .25)",
		zIndex: 10,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	loadingContainer: {
		backgroundColor: "#FFF",
		padding: 25,
		borderRadius: 10,
	},
	loadingTxt: {
		fontSize: 16,
		fontWeight: "600",
		letterSpacing: 1,
	},
	page: {
		alignItems: "center",
		marginTop: 40,
		paddingHorizontal: 30,
		width: "100%",
		height: "93.5%",
	},
	pageHeading: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	header: {
		fontWeight: "800",
		fontSize: 23,
		marginBottom: 50,
	},
	header2: {
		fontWeight: "700",
	},
	editingHeading: {
		marginBottom: 30,
		paddingBottom: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#FC6B68",
	},
	editingTitle: {
		fontSize: 18,
		fontWeight: "800",
		letterSpacing: 1.3,
		marginBottom: 25,
	},
	editingContent: {
		fontSize: 15,
		lineHeight: 30,
		fontWeight: "500",
		minWidth: "100%",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		opacity: 0.4,
	},
	tags: {
		flexDirection: "row",
	},
	tag: {
		marginRight: 10,
	},
	btnsContainer: {
		flexDirection: "row",
		backgroundColor: "#ECEAF8",
		position: "absolute",
		bottom: 0,
		right: 20,
		padding: 10,
		borderRadius: 5,
	},
	scanBtn: {
		backgroundColor: "#FC6B68",
		borderRadius: 2.5,
		padding: 15,
	},
	questionsContainer: {
		backgroundColor: "#ECEAF8",
		borderRadius: 10,
		padding: 20,
		marginVertical: 40,
	},
	questions: {
		color: "#494156",
		fontWeight: "500",
		letterSpacing: 1,
	},
});
