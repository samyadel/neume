import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	Keyboard,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import Header from "../../Header";
import Flashcard from "./FlashcardsComponents/Flashcard";
import openAIRequest from "../../../../openAIRequest";
import Carousel from "react-native-snap-carousel-expo-46-compatible";
import { TextInput } from "react-native-gesture-handler";
import LoadingCard from "../../LoadingCard";

export default function ManageFlashcards({
	flashcardsArr,
	setFlashcardsArr,
	saveFlashcards,
}) {
	const navigation = useNavigation();

	function deleteFlashcard(index) {
		const arr = flashcardsArr;

		console.log("hello");

		arr.splice(index, 1);

		setFlashcardsArr(arr);
		saveFlashcards(arr);
	}

	return (
		<View>
			<SafeAreaView style={styles.page}>
				<Header
					heading="Manage Flashcards"
					icon1={
						<Pressable onPress={navigation.goBack}>
							<AntDesign name="closecircleo" size={25} color="#FC6B68" />
						</Pressable>
					}
				/>

				<ScrollView keyboardDismissMode="on-drag" style={{ width: "100%" }}>
					{flashcardsArr.map((flashcard, i) => {
						return (
							<View
								key={i}
								style={{
									...styles.flashcardWrapper,
								}}
							>
								<Pressable onPress={() => deleteFlashcard(i)}>
									<AntDesign
										name="close"
										size={16}
										color="black"
										style={{ marginRight: 10 }}
									/>
								</Pressable>
								<Text>{flashcard.front}</Text>
							</View>
						);
					})}
				</ScrollView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	flashcardWrapper: {
		padding: 15,
		backgroundColor: "rgba(0, 0, 0, .05)",
		marginBottom: 10,
		borderRadius: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	page: {
		alignItems: "center",
		paddingHorizontal: 30,
		width: "100%",
		height: "100%",
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
		borderBottomWidth: 1,
		borderBottomColor: "#FC6B68",
	},
	editingTitle: {
		fontSize: 18,
		fontWeight: "800",
		letterSpacing: 1.3,
		marginBottom: 25,
	},
	btnContainer: {
		// position: "absolute",
		bottom: 0,
		width: "100%",
	},
	generateBtn: {
		backgroundColor: "#FC6B68",
		padding: 20,
		borderRadius: 10,
	},
	generateText: {
		textAlign: "center",
		fontWeight: "500",
		color: "white",
	},
	secondaryBtn: {
		backgroundColor: "white",
	},
	secondaryBtnText: {
		color: "#FC6B68",
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
	bgColorOptions: {
		flexDirection: "row",
		marginBottom: 20,
	},
	bgColorOption: {
		width: 35,
		height: 35,
		borderRadius: 5,
		backgroundColor: "#000",
		marginRight: 10,
	},
});
