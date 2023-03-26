import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { auth } from "../../../../firebaseConfig";
import firebase from "../../../../firebaseConfig";

import Header from "../../Header";
import useRevenueCat from "../../../../hooks/useRevenueCat";

import { Picker } from "@react-native-picker/picker";

import openAIRequest, { es } from "../../../../openAIRequest";

function Page1({ selectedSubject, setSelectedSubject, setPage, page }) {
	return (
		<View style={styles.inputContainer}>
			<Text style={styles.pageHeading}>
				What subject do you want to make a note for?
			</Text>

			<Picker
				style={styles.generateOption}
				selectedValue={selectedSubject}
				onValueChange={(itemValue) => setSelectedSubject(itemValue)}
			>
				<Picker.Item label="English" value="english" />
				<Picker.Item label="Maths" value="maths" />
				<Picker.Item label="Chemistry" value="chemistry" />
				<Picker.Item label="Biology" value="biology" />
				<Picker.Item label="Physics" value="physics" />
				<Picker.Item label="History" value="history" />
				<Picker.Item label="Geography" value="geography" />
				<Picker.Item label="Economics" value="economics" />
				<Picker.Item label="Business" value="business" />
				<Picker.Item
					label="Design and Technology"
					value="design-and-technology"
				/>
				<Picker.Item label="Art and Design" value="art" />
				<Picker.Item label="Music" value="music" />
				<Picker.Item label="Physical Education" value="physical-education" />
				<Picker.Item label="Computing" value="computing" />
			</Picker>

			<View style={styles.buttonsWrapper}>
				<Pressable
					style={{
						...styles.button,
						backgroundColor: "rgba(0, 0, 0, .1)",
					}}
				>
					<Text style={{ ...styles.buttonText, color: "#fff" }}>Back</Text>
				</Pressable>

				<Pressable style={styles.button} onPress={() => setPage(page + 1)}>
					<Text style={styles.buttonText}>Next</Text>
				</Pressable>
			</View>
		</View>
	);
}

function Page2({ selectedLevel, setSelectedLevel, setPage, page }) {
	return (
		<View style={styles.inputContainer}>
			<Text style={styles.pageHeading}>What level are you studying at?</Text>

			<Picker
				style={styles.generateOption}
				selectedValue={selectedLevel}
				onValueChange={(itemValue) => setSelectedLevel(itemValue)}
			>
				<Picker.Item label="GCSE" value="gcse" />
				<Picker.Item label="IGCSE" value="igcse" />
				<Picker.Item label="A Level" value="a-level" />
				<Picker.Item label="AS Level" value="as-level" />
				<Picker.Item label="BTEC" value="btec" />
				<Picker.Item label="IB" value="ib" />
			</Picker>

			<View style={styles.buttonsWrapper}>
				<Pressable style={styles.button} onPress={() => setPage(page - 1)}>
					<Text style={styles.buttonText}>Back</Text>
				</Pressable>

				<Pressable style={styles.button} onPress={() => setPage(page + 1)}>
					<Text style={styles.buttonText}>Next</Text>
				</Pressable>
			</View>
		</View>
	);
}

function Page3({
	setPage,
	page,
	generateNote,
	level,
	subject,
	tokens,
	isProMember,
	content,
	setTitle,
}) {
	const [topic, setTopic] = useState();

	return (
		<View style={styles.inputContainer} key={page}>
			<Text style={styles.pageHeading}>What topic are you studying?</Text>

			<TextInput
				style={{ ...styles.generateOption, padding: 20 }}
				placeholder="Topic"
				onChangeText={(newTopic) => setTopic(newTopic)}
			/>

			<View style={styles.buttonsWrapper}>
				<Pressable style={styles.button} onPress={() => setPage(page - 1)}>
					<Text style={styles.buttonText}>Back</Text>
				</Pressable>

				<Pressable
					style={styles.button}
					onPress={() => {
						if (topic) {
							if (tokens < 2 && !isProMember) {
								Alert.alert(
									"Not enough tokens",
									"Generating notes requires 2 tokens"
								);
								return;
							}

							if (!isProMember) {
								Alert.alert(
									"Use 2 tokens",
									`You currently have ${tokens} token${tokens !== 1 && "s"}`,
									[
										{
											text: "Use",
											style: "default",
											onPress: () => {
												generateNote(topic, level, subject);
												setPage(page + 1);
												setTitle(topic);
											},
										},
										{
											text: "Cancel",
											style: "cancel",
										},
									],
									{ cancelable: true }
								);
							} else {
								generateNote(topic, level, subject);
								setPage(page + 1);
								setTitle(topic);
							}
						} else {
							Alert.alert("Missing fields", "Please fill out all fields");
						}
					}}
				>
					<Text style={styles.buttonText}>Generate</Text>
				</Pressable>
			</View>
		</View>
	);
}

function Page4({ content }) {
	return (
		<View style={styles.inputContainer}>
			<Text style={styles.pageHeading}>Your note is being written...</Text>

			<Text
				style={{
					...styles.generateOption,
					padding: 20,
					fontWeight: "400",
					fontSize: 14,
				}}
			>
				{content}
			</Text>
		</View>
	);
}

export default function GenerateNote({
	createNote,
	setClickedNote,
	loading,
	setLoading,
	tokens,
	setTokens,
}) {
	const navigation = useNavigation();
	const [selectedSubject, setSelectedSubject] = useState("english");
	const [selectedLevel, setSelectedLevel] = useState("gcse");
	const [page, setPage] = useState(1);
	const [done, setDone] = useState(false);
	const [title, setTitle] = useState("");
	const [error, setError] = useState();
	const [cancel, setCancel] = useState(false);

	const [content, setContent] = useState("");

	const usersCollection = firebase.firestore().collection("users");

	const { isProMember } = useRevenueCat();

	const scrollviewRef = useRef();

	useEffect(() => {
		if (error === "connection") {
			Alert.alert(
				"Connection error",
				"The connection was interrupted. Trying again"
			);
		} else if (error === "exception") {
			Alert.alert(
				"Unexpected error",
				"An error occured while trying to generate your note. Please try again"
			);
		}
	}, [error]);

	useEffect(() => {
		if (cancel) {
			es.close();
			navigation.goBack();
		}
	}, [cancel]);

	useEffect(() => {
		if (done) {
			if (content.substring(0, 5).toLowerCase() !== "false") {
				console.log("DONE");

				if (!isProMember) {
					usersCollection.doc(auth.currentUser.uid).update({
						tokens: tokens - 2,
					});
					setTokens(tokens - 2);
				}

				const noteId = createNote(title, content, [], "#F2F8FF");
				navigation.goBack();
				setClickedNote({
					title,
					content,
					bgColor: "#F2F8FF",
					id: noteId,
				});
				navigation.navigate("Edit");
			} else {
				Alert.alert("Invalid topic", `The topic you entered is not valid`);
			}
		}
	}, [done]);

	function Form() {
		switch (page) {
			case 1:
				return (
					<Page1
						page={page}
						setPage={setPage}
						setSelectedSubject={setSelectedSubject}
						selectedSubject={selectedSubject}
					/>
				);
			case 2:
				return (
					<Page2
						page={page}
						setPage={setPage}
						setSelectedLevel={setSelectedLevel}
						selectedLevel={selectedLevel}
					/>
				);
			case 3:
				return (
					<Page3
						page={page}
						setPage={setPage}
						generateNote={generateNote}
						level={selectedLevel}
						subject={selectedSubject}
						tokens={tokens}
						isProMember={isProMember}
						content={content}
						setTitle={setTitle}
					/>
				);
			case 4:
				return <Page4 page={page} content={content} setCancel={setCancel} />;
		}
	}

	async function generateNote(topic, level, subject) {
		setLoading(true);

		openAIRequest(
			[
				{
					role: "system",
					content: "I want you to act as a professional note taker",
				},
				{
					role: "user",
					content: `True or false, ${topic} is a ${subject} topic. If the answer is true, generate detailed ${subject} study notes for ${level} students about ${topic}. If the answer is false, simply say "False"`,
					// content: `If ${topic} is part of the ${subject} ${level} curriculum at schools, generate detailed ${subject} study notes for ${level} students, about the following topic for ${topic}. If it isn't, or if you are unsure or unable to confirm, say "false"`,
				},
			],
			setContent,
			setDone,
			setLoading,
			setError
		);
	}

	return (
		<ScrollView
			ref={scrollviewRef}
			onContentSizeChange={() =>
				scrollviewRef.current.scrollToEnd({ animated: true })
			}
		>
			<View style={styles.container}>
				<SafeAreaView style={styles.page}>
					<Header
						heading="Generate Note"
						icon1={
							<Pressable
								style={styles.returnBtn}
								onPress={() => {
									if (!loading) {
										navigation.goBack();
									} else {
										Alert.alert(
											"Cancel note?",
											`Your note is being written. Do you want to cancel?`,
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
										);
									}
								}}
							>
								<AntDesign name="closecircleo" size={25} color="#CD4F50" />
							</Pressable>
						}
					/>
					<Form />
				</SafeAreaView>
			</View>
		</ScrollView>
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
	pageHeading: {
		fontWeight: "600",
		fontSize: 20,
		marginBottom: 30,
	},
	inputContainer: {
		width: "100%",
	},
	generateOption: {
		backgroundColor: "rgba(0, 0, 0, .04)",
		// padding: 20,
		fontSize: 16,
		fontWeight: "600",
		borderRadius: 10,
		marginBottom: 25,
	},
	buttonsWrapper: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	button: {
		backgroundColor: "#FC6B68",
		width: "45%",
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
