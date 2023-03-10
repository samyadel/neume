import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import { auth } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();

	const navigation = useNavigation();

	function handleSignup() {
		auth
			.createUserWithEmailAndPassword(email, password)
			.then(async (userCredentials) => {
				const user = userCredentials.user;

				const UserModel = {
					notes: [],
				};

				await setDoc(doc(db, "users", user.uid), UserModel);

				console.log(`Registered with ${user.email}`);
			})
			.catch((e) => {
				alert(e.message);
			});
	}

	return (
		<SafeAreaView style={styles.page}>
			<Text style={styles.heading}>Hey There!</Text>
			<Text style={styles.subheading}>
				Register now to get full access to Neume!
			</Text>

			<TextInput
				style={styles.input}
				placeholder="Enter email"
				keyboardType="email-address"
				value={email}
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				keyboardType="visible-password"
				value={password}
				onChangeText={(text) => setPassword(text)}
			/>

			<Pressable style={styles.loginBtn} onPress={handleSignup}>
				<Text style={styles.loginBtnTxt}>Register</Text>
			</Pressable>

			<Text style={styles.otherOptionsTxt}>Or continue with</Text>

			<View style={styles.oAuthContainer}>
				<Pressable style={styles.oAuthOption}>
					<Image
						style={styles.oAuthLogo}
						source={require("../../../assets/googleLogo.png")}
					/>
				</Pressable>
				<Pressable style={styles.oAuthOption}>
					<Image
						style={styles.oAuthLogo}
						source={require("../../../assets/appleLogo.png")}
					/>
				</Pressable>
			</View>

			<View style={styles.registerInsteadContainer}>
				<Text style={styles.registerInstead}>Already a member? </Text>
				<Pressable onPress={() => navigation.navigate("Login")}>
					<Text style={[styles.registerInstead, styles.registerBtn]}>
						Log in
					</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
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
		marginTop: 20,
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
