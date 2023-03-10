import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Alert,
	Keyboard,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import axios from "axios";

import LoadingCard from "../../LoadingCard";
import Header from "../../Header";

export default function GenerateNote({
	setCreatedNoteContent,
	setCreatedNoteTitle,
}) {
	const navigation = useNavigation();

	const [topic, setTopic] = useState("");
	const [level, setLevel] = useState("");
	const [examBoard, setExamBoard] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function generateNote(topic, level, examBoard) {
		setIsLoading(true);
		Keyboard.dismiss();

		const apiKey = "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";
		const apiUrl = "https://api.openai.com/v1/completions";

		const prompt = `Generate detailed study notes at ${level} level, appropriate for the ${examBoard} exam board, about the following topic: ${topic}`;
		const res = await axios
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
				Alert.alert("Oh oh!", "Something went wrong. Please try again.", [
					{ text: "OK" },
				]);

				setIsLoading(false);
				console.log(e);
			});

		const generatedNoteContent = res.data.choices[0].text.toLowerCase().trim();

		setCreatedNoteTitle(topic);
		setCreatedNoteContent(generatedNoteContent);

		setIsLoading(false);

		navigation.goBack();
	}

	return (
		<View>
			<ScrollView style={styles.container}>
				<SafeAreaView style={styles.page}>
					<Header
						heading="Generate Note"
						icon1={
							<Pressable style={styles.returnBtn} onPress={navigation.goBack}>
								<AntDesign name="closecircleo" size={25} color="#CD4F50" />
							</Pressable>
						}
						icon2={
							<Pressable style={styles.returnBtn} onPress={navigation.goBack}>
								<AntDesign name="infocirlceo" size={25} color="#CD4F50" />
							</Pressable>
						}
					/>

					<View style={styles.inputContainer}>
						<TextInput
							style={styles.generateOption}
							placeholder="Lesson topic"
							onChangeText={(topic) => setTopic(topic)}
						/>
						<TextInput
							style={styles.generateOption}
							placeholder="Knowledge level"
							onChangeText={(level) => setLevel(level)}
						/>
						<TextInput
							style={styles.generateOption}
							placeholder="Exam board"
							onChangeText={(examBoard) => setExamBoard(examBoard)}
						/>
						<Pressable
							style={styles.button}
							onPress={() => generateNote(topic, level, examBoard)}
						>
							<Text style={styles.buttonText}>Generate</Text>
						</Pressable>
					</View>
				</SafeAreaView>
			</ScrollView>
			<LoadingCard
				loadingText={"Generating notes"}
				isLoading={isLoading}
				width="55%"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	page: {
		alignItems: "center",
		paddingHorizontal: 30,
		width: "100%",
		height: "100%",
	},
	inputContainer: {
		width: "100%",
	},
	generateOption: {
		backgroundColor: "rgba(0, 0, 0, .04)",
		padding: 20,
		fontSize: 16,
		fontWeight: "600",
		borderRadius: 10,
		marginBottom: 25,
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
		fontSize: 18,
		fontWeight: "700",
	},
});
