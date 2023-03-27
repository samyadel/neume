import {
	View,
	Text,
	StyleSheet,
	Keyboard,
	Pressable,
	TextInput,
	Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import firebase, { auth, db } from "../../../../firebaseConfig";
import Header from "../../Header";

import { ScrollView } from "react-native-gesture-handler";

export default function AccountInformation() {
	const navigation = useNavigation();

	console.log(firebase.auth().currentUser.providerData[0].email);

	const [email, setEmail] = useState(
		firebase.auth().currentUser.providerData[0].email
	);
	const [password, setPassword] = useState("");
	const [isOAuth, setIsOAuth] = useState(false);

	useEffect(() => {
		if (
			firebase.auth().currentUser.providerData[0].providerId === "apple.com" ||
			firebase.auth().currentUser.providerData[0].providerId === "google.com"
		) {
			setIsOAuth(true);
		}
	}, []);

	const reauthenticate = () => {
		const user = firebase.auth().currentUser;
		const cred = firebase.auth.EmailAuthProvider.credential(
			user.email,
			password
		);
		return user.reauthenticateWithCredential(cred);
	};

	return (
		<ScrollView>
			<Pressable onPress={Keyboard.dismiss}>
				<SafeAreaView style={styles.page}>
					<Header
						heading="Update Information"
						icon1={
							<Pressable onPress={navigation.goBack}>
								<AntDesign name="closecircleo" size={25} color="#FC6B68" />
							</Pressable>
						}
					/>

					<View style={styles.inputContainer}>
						<TextInput
							style={{
								...styles.generateOption,
								color: isOAuth ? "rgba(0, 0, 0, .4)" : "#000",
							}}
							placeholder={"New email"}
							defaultValue={email}
							keyboardType="email-address"
							onChangeText={(email) => setEmail(email)}
							editable={!isOAuth}
						/>
						<TextInput
							style={styles.generateOption}
							placeholder="Password"
							onChangeText={setPassword}
							editable={!isOAuth}
						/>
						<Pressable
							disabled={isOAuth}
							style={styles.button}
							onPress={() => {
								reauthenticate()
									.then(() => {
										auth.currentUser.email !== email &&
											auth.currentUser
												.updateEmail(email)
												.then(() => {
													Alert.alert("Your email has been updated");
												})
												.catch((e) => {
													Alert.alert(
														"Something went wrong",
														"Please make sure you've entered a valid email, and that your password is correct"
													);
												});
									})
									.catch((e) => {
										Alert.alert(
											"Something went wrong",
											"Please make sure you've entered a valid email, and that your password is correct"
										);
									});
							}}
						>
							<Text style={styles.buttonText}>Update Account</Text>
						</Pressable>
						<Pressable
							style={{ ...styles.button, backgroundColor: "#fff", padding: 0 }}
							onPress={() => {
								Alert.alert(
									"Delete account?",
									"This action is permanent",
									[
										{
											text: "Delete",
											onPress: async () => {
												// reauthenticate()
												// .then(async () => {
												const userId = firebase.auth().currentUser.uid;
												firebase
													.auth()
													.currentUser.delete()
													.then(async () => {
														await firebase
															.firestore()
															.collection("users")
															.doc(userId)
															.delete();

														navigation.reset({
															index: 0,
															routes: [{ name: "GetStarted" }],
														});
														Alert.alert("Account deleted");
													})
													.catch(async (e) => {
														await reauthenticate().catch((e) => {
															console.log(e);
															Alert.alert(
																"Enter your password to delete your account"
															);
														});

														firebase
															.auth()
															.currentUser.delete()
															.then(async () => {
																await firebase
																	.firestore()
																	.collection("users")
																	.doc(userId)
																	.delete();

																navigation.reset({
																	index: 0,
																	routes: [{ name: "GetStarted" }],
																});
																Alert.alert("Account deleted");
															});
													});
											},
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
							}}
						>
							<Text
								style={{
									...styles.buttonText,
									color: "#FC6B68",
									fontWeight: "400",
								}}
							>
								Delete account
							</Text>
						</Pressable>
					</View>
				</SafeAreaView>
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	statusText: {
		marginTop: 20,
		color: "#494156",
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
