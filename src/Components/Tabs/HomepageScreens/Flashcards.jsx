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
import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import Header from "../../Header";
import Flashcard from "./FlashcardsComponents/Flashcard";
import openAIRequest, { es } from "../../../../openAIRequest";
import Carousel from "react-native-snap-carousel-expo-46-compatible";
import { TextInput } from "react-native-gesture-handler";
import { auth } from "../../../../firebaseConfig";
import firebase from "../../../../firebaseConfig";
import useRevenueCat from "../../../../hooks/useRevenueCat";

export default function Flashcards({
	note,
	saveFlashcards,
	loading,
	setLoading,
	flashcardsArr,
	setFlashcardsArr,
	tokens,
	setTokens,
}) {
	const { title, content, flashcards } = note;

	const [creatingFlashcard, setCreatingFlashcard] = useState(false);
	const [front, setFront] = useState("");
	const [back, setBack] = useState("");
	const [error, setError] = useState();
	const [flashcardsArray, setFlashcardsArray] = useState();
	const [done, setDone] = useState(false);
	const scrollviewRef = useRef();
	const navigation = useNavigation();
	const { isProMember } = useRevenueCat();

	const [cancel, setCancel] = useState(false);

	const usersCollection = firebase.firestore().collection("users");

	useEffect(() => {
		setFlashcardsArr(flashcards || []);
	}, []);

	useEffect(() => {
		if (cancel) {
			es.close();
			navigation.goBack();
		}
	}, [cancel]);

	useEffect(() => {
		if (error === "connection") {
			Alert.alert(
				"Connection error",
				"The connection was interrupted. Trying again"
			);
		} else if (error === "exception") {
			Alert.alert(
				"Unexpected error",
				"An error occured while trying to generate your flashcards. Please try again"
			);
		}
	}, [error]);

	function handleGenerate() {
		console.log(flashcardsArr.length);
		if (flashcardsArr.length > 0) {
			Alert.alert(
				"Generate flashcards?",
				"Any existing flashcards for this note will be replaced by new flashcards",
				[
					{
						text: "Continue",
						onPress: generateFlashcards,
						style: "default",
					},
					{
						text: "Cancel",
						style: "cancel",
					},
				],
				{
					cancelable: true,
					onDismiss: () =>
						Alert.alert(
							"This alert was dismissed by tapping outside of the alert dialog."
						),
				}
			);
		} else {
			generateFlashcards();
		}
	}

	useEffect(() => {
		if (done) {
			const flashcards = JSON.parse(flashcardsArray).flashcards;
			console.log(flashcards);
			setFlashcardsArr(flashcards);
			saveFlashcards(flashcards);

			if (!isProMember) {
				usersCollection.doc(auth.currentUser.uid).update({
					tokens: tokens - 1,
				});
				setTokens(tokens - 1);
			}
		}
	}, [done]);

	function generateFlashcards() {
		setLoading(true);
		setFlashcardsArray();

		console.log("LOADING...");

		openAIRequest(
			[
				{
					role: "user",
					content: `Create a set of flashcards about the notes I will provide. Return the flashcards in a JSON object format. All flashcards should be contained in the object property called 'flashcards' and be stored as an array. Each flashcard in the 'flashcards' array should have properties 'front' and 'back'. Keep the flashcard answers below 30 words. Here are the notes to create the flashcards from: ${content}`,
				},
			],
			setFlashcardsArray,
			setDone,
			setLoading,
			setError
		);
	}

	function createFlashcard() {
		const newFlashcardArr = [{ front, back }, ...flashcardsArr];
		setFlashcardsArr(newFlashcardArr);
		saveFlashcards(newFlashcardArr);
		setCreatingFlashcard(false);
	}

	function deleteFlashcard(index) {
		const arr = flashcardsArr;

		console.log("hello");

		arr.splice(index, 1);

		setFlashcardsArr(arr);
	}

	function _renderItem({ item, index }) {
		return (
			<Flashcard
				flashcard={item}
				index={index}
				deleteFlashcard={deleteFlashcard}
			/>
		);
	}

	return (
		<View>
			{creatingFlashcard && (
				<Pressable style={styles.overlay} onPress={Keyboard.dismiss}>
					<View style={styles.createFlashWrapper}>
						<TextInput
							style={styles.flashcardInput}
							placeholder="Front"
							defaultValue={front}
							onChangeText={setFront}
						/>
						<TextInput
							style={styles.flashcardInput}
							placeholder="Back"
							defaultValue={back}
							onChangeText={setBack}
						/>

						<Pressable
							style={styles.createBtn}
							onPress={() => {
								if (front && back) {
									createFlashcard();
								} else {
									Alert.alert("Missing fields", "Please fill out all fields");
								}
							}}
						>
							<Text>Create</Text>
						</Pressable>
						<Pressable
							style={styles.createBtn}
							onPress={() => setCreatingFlashcard(false)}
						>
							<Text>Cancel</Text>
						</Pressable>
					</View>
				</Pressable>
			)}

			<SafeAreaView style={styles.page}>
				<Header
					heading="Flashcards"
					icon1={
						<Pressable
							onPress={() =>
								loading
									? Alert.alert(
											"Cancel flashcards?",
											`Your flashcards are being generated. Do you want to cancel?`,
											[
												{
													text: "Cancel",
													style: "default",
													onPress() {
														console.log("cancelling");
														setCancel(true);
													},
												},
												{
													text: "Continue",
													style: "cancel",
												},
											],
											{ cancelable: true }
									  )
									: navigation.goBack()
							}
						>
							<AntDesign name="closecircleo" size={25} color="#FC6B68" />
						</Pressable>
					}
					icon2={
						<Pressable onPress={() => navigation.navigate("ManageFlashcards")}>
							<Feather name="edit" size={24} color="#FC6B68" />
						</Pressable>
					}
				/>

				<ScrollView
					keyboardDismissMode="on-drag"
					style={{ width: "100%" }}
					contentContainerStyle={{ height: "100%" }}
				>
					<View style={styles.editingHeading}>
						<Text style={styles.editingTitle}>{title}</Text>
					</View>

					<View
						style={{
							flex: 1,
							flexDirection: "row",
							justifyContent: "center",
						}}
					>
						{flashcardsArr.length > 0 && !loading ? (
							<Carousel
								removeClippedSubviews={false}
								layout={"default"}
								data={flashcardsArr}
								renderItem={_renderItem}
								sliderWidth={100}
								itemWidth={300}
							/>
						) : loading ? (
							<View
								style={{
									marginBottom: 20,
									height: "95%",
									width: "100%",
									justifyContent: "center",
								}}
							>
								<FontAwesome
									name="gear"
									size={45}
									color="rgba(0, 0, 0, .7)"
									style={{
										alignSelf: "center",
									}}
								/>

								<ScrollView
									style={{
										position: "absolute",
										width: "100%",
										height: "100%",
										backgroundColor: "rgba(0, 0, 0, .03)",
										opacity: 0.2,
									}}
									ref={scrollviewRef}
									onContentSizeChange={() =>
										scrollviewRef.current.scrollToEnd({ animated: true })
									}
								>
									<Text>{flashcardsArray}</Text>
								</ScrollView>
							</View>
						) : (
							<View style={styles.noNoteContainer}>
								<Text style={styles.noNoteHeading}>
									Practice what you've learnt
								</Text>
								<Text style={styles.noNoteSubheading}>
									Create a flashcard manually, or generate one from your notes
								</Text>
							</View>
						)}
					</View>
					<View style={styles.btnContainer}>
						<Pressable
							style={styles.generateBtn}
							onPress={() => {
								if (tokens < 1 && !isProMember) {
									Alert.alert(
										"Not enough tokens",
										"Generating flashcards requires 1 token"
									);
									return;
								}

								if (!isProMember) {
									Alert.alert(
										"Use 1 token",
										`You currently have ${tokens} token${tokens !== 1 && "s"}`,
										[
											{
												text: "Use",
												style: "default",
												onPress: handleGenerate,
											},
											{
												text: "Cancel",
												style: "cancel",
											},
										],
										{ cancelable: true }
									);
								} else {
									handleGenerate();
								}
							}}
						>
							{loading ? (
								<ActivityIndicator size={24} color={"white"} />
							) : (
								<Text style={styles.generateText}>Generate flashcards</Text>
							)}
						</Pressable>

						<Pressable
							style={[styles.generateBtn, styles.secondaryBtn]}
							onPress={() => setCreatingFlashcard(true)}
						>
							<Text style={[styles.generateText, styles.secondaryBtnText]}>
								Manually create flashcard
							</Text>
						</Pressable>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	noNoteContainer: {
		opacity: 0.7,
		justifyContent: "center",
		height: 400,
	},
	noNoteHeading: {
		fontWeight: "700",
		fontSize: 25,
		textAlign: "center",
		marginBottom: 15,
		color: "#494156",
	},
	noNoteSubheading: {
		textAlign: "center",
		width: "70%",
		alignSelf: "center",
		fontSize: 17,
		lineHeight: 30,
		opacity: 0.7,
		fontWeight: "500",
		marginBottom: 50,
		color: "#494156",
	},
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
	createFlashWrapper: {
		backgroundColor: "#FFF",
		width: 300,
		height: 250,
		padding: 30,
		borderRadius: 5,
		justifyContent: "space-evenly",
	},
	createBtn: {
		backgroundColor: "rgba(0, 0, 0, .1)",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
	},
	flashcardInput: {
		// marginVertical: 20,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, .4)",
		padding: 10,
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
