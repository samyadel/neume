import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../../firebaseConfig";
import { AntDesign } from "@expo/vector-icons";

export default function ForgotPassword() {
	const [email, setEmail] = useState();

	const navigation = useNavigation();

	function handleForgot() {
		if (email) {
			firebase
				.auth()
				.sendPasswordResetEmail(email)
				.then(() => {
					Alert.alert(
						"Check your email",
						"We've sent you an email to reset your password. Check your inbox or spam",
						[
							{
								text: "OK",
								onPress: async () => {
									navigation.navigate("Login");
								},
								style: "OK",
							},
						]
					);
				})
				.catch((e) => {
					Alert.alert(
						"Something went wrong",
						"Ensure you've provided a valid email and try again",
						[
							{
								text: "OK",
								onPress: async () => {
									navigation.navigate("Login");
								},
								style: "OK",
							},
						]
					);
				});
		} else {
			Alert.alert("Missing fields", "Please fill out all fields");
		}
	}

	return (
		<SafeAreaView style={styles.page}>
			<ScrollView>
				<Text style={styles.heading}>Reset your password</Text>
				<Text style={styles.subheading}>
					We'll send you an email to reset your password
				</Text>

				<TextInput
					style={styles.input}
					placeholder="Enter email"
					keyboardType="email-address"
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>

				<Pressable style={styles.loginBtn} onPress={handleForgot}>
					<Text style={styles.loginBtnTxt}>Reset your password</Text>
				</Pressable>

				<View style={{ ...styles.registerInsteadContainer, marginTop: 30 }}>
					<Pressable onPress={navigation.goBack}>
						<Text style={[styles.registerInstead, styles.registerBtn]}>
							Go back to login
						</Text>
					</Pressable>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	statusText: {
		marginTop: 20,
		color: "#494156",
	},
	page: {
		padding: 30,
		paddingTop: 90,
		backgroundColor: "#ECEAF8",
		flex: 1,
	},
	heading: {
		fontWeight: "700",
		fontSize: 30,
		textAlign: "center",
		marginBottom: 30,
		color: "#494156",
	},
	subheading: {
		textAlign: "center",
		width: "70%",
		alignSelf: "center",
		fontSize: 20,
		lineHeight: 30,
		opacity: 0.7,
		fontWeight: "500",
		marginBottom: 50,
		color: "#494156",
	},
	input: {
		backgroundColor: "#FFF",
		padding: 20,
		borderRadius: 12,
		marginBottom: 22,
		fontSize: 16,
		fontWeight: "700",
	},
	forgotPass: {
		textAlign: "right",
		fontWeight: "700",
		fontSize: 15,
		marginBottom: 40,
		marginTop: 10,
		color: "#494156",
	},
	loginBtn: {
		backgroundColor: "#FC6B68",
		padding: 22,
		borderRadius: 12,
	},
	loginBtnTxt: {
		color: "#FFF",
		fontWeight: "700",
		textAlign: "center",
		fontSize: 18,
	},
	otherOptionsTxt: {
		marginVertical: 45,
		textAlign: "center",
		color: "#494156",
		fontWeight: "600",
	},
	oAuthContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginBottom: 50,
	},
	oAuthOption: {
		width: "30%",
		height: 65,
		borderWidth: 3,
		borderColor: "#FFF",
		borderRadius: 10,
		padding: 14,
	},
	oAuthLogo: {
		height: "100%",
		width: undefined,
		aspectRatio: 1,
		resizeMode: "contain",
		alignSelf: "center",
		opacity: 0.8,
	},
	registerInsteadContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	registerInstead: {
		textAlign: "center",
		fontWeight: "500",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		marginRight: 3,
	},
	registerBtn: {
		color: "#3E85DF",
	},
});
