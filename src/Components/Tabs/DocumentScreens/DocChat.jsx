import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	Pressable,
	TextInput,
	Keyboard,
	KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../Header";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import openAIRequest from "../../../../openAIRequest";

export default function DocChat({ content, docAllChats, saveChat }) {
	const navigation = useNavigation();

	const [allChats, setAllChats] = useState(docAllChats);
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [done, setDone] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();

	const scrollviewRef = useRef();

	useEffect(() => {
		if (done && answer.length > 0) {
			const allChatsArr = [...allChats, { sender: "ai", message: answer }];
			setAllChats(allChatsArr);
			saveChat(allChatsArr);
			setAnswer("");
		}
	}, [done]);

	useEffect(() => {
		if (error === "connection") {
			Alert.alert(
				"Connection error",
				"The connection was interrupted. Trying again"
			);
		} else if (error === "exception") {
			Alert.alert(
				"Unexpected error",
				"An error occured while trying to write a response. Please try again"
			);
		}
	}, [error]);

	function addChat() {
		const userQuestion = question;
		setAllChats([...allChats, { sender: "user", message: question }]);
		setDone(false);

		openAIRequest(
			[
				{
					role: "user",
					content: `According to the essay provided, answer the following question. Please provide the section of the document you got your answer from. If no answer is available from the essay, please say so. HERE IS THE ESSAY: ${content}. HERE IS THE QUESTION: ${userQuestion}`,
				},
			],
			setAnswer,
			setDone,
			setLoading,
			setError
		);

		// while (answer.length <= 0) {
		// 	setTimeout(() => {
		// 		openAIRequest(
		// 			[
		// 				{
		// 					role: "user",
		// 					content: `According to the essay provided, answer the following question. Please provide the section of the document you got your answer from. If no answer is available from the essay, please say so. HERE IS THE ESSAY: ${content}. HERE IS THE QUESTION: ${userQuestion}`,
		// 				},
		// 			],
		// 			setAnswer,
		// 			setDone,
		// 			setLoading,
		// 			setError
		// 		);
		// 	}, 10000);
		// }

		setQuestion("");
	}

	return (
		<KeyboardAvoidingView behavior="padding">
			<SafeAreaView
				style={styles.container}
				automaticallyAdjustKeyboardInsets={true}
			>
				<View style={styles.page}>
					<Header
						heading="Chat to your document"
						icon1={
							<Pressable style={styles.returnBtn} onPress={navigation.goBack}>
								<Ionicons name="arrow-back" size={25} color="black" />
							</Pressable>
						}
					/>

					<ScrollView
						keyboardDismissMode="interactive"
						ref={scrollviewRef}
						onContentSizeChange={() =>
							scrollviewRef.current.scrollToEnd({ animated: true })
						}
					>
						{allChats.map((chat, i) => (
							<View style={styles.chatWrapper} key={i}>
								<View
									style={
										chat.sender === "user" ? styles.userChat : styles.aiChat
									}
								>
									<Text style={chat.sender === "user" && styles.userChatText}>
										{chat.message}
									</Text>
								</View>
							</View>
						))}
						{answer.length > 0 && (
							<View style={styles.chatWrapper}>
								<View style={styles.aiChat}>
									<Text>{answer}</Text>
								</View>
							</View>
						)}
					</ScrollView>
				</View>
				<View style={styles.inputWrapper}>
					<TextInput
						style={{
							width: "90%",
							paddingTop: 15,
							paddingLeft: 15,
							paddingBottom: 15,
						}}
						placeholder="Type your question..."
						onChangeText={setQuestion}
						value={question}
						editable={!answer}
					/>

					<Pressable
						style={{ width: "10%", paddingRight: 15 }}
						onPress={() => {
							if (!question) return;
							addChat();
						}}
					>
						<Ionicons name="send-outline" size={18} color="black" />
					</Pressable>
				</View>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	page: {
		// alignItems: "center",
		paddingHorizontal: 30,
		width: "100%",
		height: "88%",
		marginTop: 47,
		paddingBottom: 50,
	},
	inputContainer: {
		width: "100%",
	},
	documentInput: {
		backgroundColor: "rgba(0, 0, 0, .04)",
		fontSize: 16,
		// fontWeight: "500",
		borderRadius: 10,
		marginBottom: 25,
		padding: 20,
		width: "100%",
	},
	button: {
		backgroundColor: "#FC6B68",
		width: "45%",
		padding: 10,
		paddingVertical: 20,
		borderRadius: 5,
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		// fontSize: 18,
		fontWeight: "700",
	},
	chatWrapper: {
		width: "100%",
		marginBottom: 15,
	},
	aiChat: {
		padding: 20,
		backgroundColor: "#E9E9EB",
		borderRadius: 20,
		width: 300,
	},
	userChat: {
		padding: 20,
		backgroundColor: "#1C8FFC",
		borderRadius: 20,
		maxWidth: 300,
		alignSelf: "flex-end",
	},
	userChatText: {
		color: "#FFF",
		fontWeight: 500,
	},
	inputWrapper: {
		borderWidth: 2,
		// borderRadius: 10,
		borderColor: "rgba(0, 0, 0, .2)",
		position: "absolute",
		width: "100%",
		bottom: 0,
		alignSelf: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#FFF",
	},
});
