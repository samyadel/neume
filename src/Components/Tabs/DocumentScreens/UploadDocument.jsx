import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	Pressable,
	TextInput,
	Keyboard,
	Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import Header from "../../Header";
import { useNavigation } from "@react-navigation/native";
import useRevenueCat from "../../../../hooks/useRevenueCat";

export default function UploadDocument({ uploadDocument, tokens }) {
	const navigation = useNavigation();

	const [docName, setDocName] = useState("");
	const [docContent, setDocContent] = useState("");

	const { isProMember } = useRevenueCat();

	return (
		<Pressable onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<SafeAreaView style={styles.page}>
					<Header
						heading="Upload Document"
						icon1={
							<Pressable style={styles.returnBtn} onPress={navigation.goBack}>
								<AntDesign name="closecircleo" size={25} color="#CD4F50" />
							</Pressable>
						}
					/>

					<TextInput
						style={styles.documentInput}
						placeholder="Document name"
						onChangeText={setDocName}
					/>

					<TextInput
						style={{ ...styles.documentInput, height: 200 }}
						placeholder="Paste your document..."
						multiline
						onChangeText={setDocContent}
					/>

					<Pressable
						style={styles.button}
						onPress={() => {
							if (tokens < 3 && !isProMember) {
								Alert.alert(
									"Not enough tokens",
									"Uploading smart documents requires 3 tokens"
								);
								return;
							}

							if (docName && docContent) {
								if (docName.length < 3) {
									Alert.alert(
										"Name is too short",
										"Your document name must be at least 3 characters long"
									);

									return;
								}

								if (docContent.length < 20) {
									Alert.alert(
										"Not enough content",
										"Your document must contain at least 20 characters"
									);

									return;
								}

								if (!isProMember) {
									Alert.alert(
										"Use 3 tokens",
										`You currently have ${tokens} token${tokens !== 1 && "s"}`,
										[
											{
												text: "Use",
												style: "default",
												onPress: () => {
													uploadDocument(docName, docContent);
													navigation.goBack();
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
									uploadDocument(docName, docContent);
									navigation.goBack();
								}
							} else {
								Alert.alert("Missing fields", "Please fill out all fields");
							}
						}}
					>
						<Text style={styles.buttonText}>Upload Document</Text>
					</Pressable>
				</SafeAreaView>
			</View>
		</Pressable>
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
		marginTop: 47,
	},
	inputContainer: {
		width: "100%",
	},
	documentInput: {
		backgroundColor: "rgba(0, 0, 0, .04)",
		fontSize: 16,
		fontWeight: "600",
		borderRadius: 10,
		marginBottom: 25,
		padding: 20,
		width: "100%",
		paddingTop: 20,
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
});
