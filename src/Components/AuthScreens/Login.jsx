import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { db } from "../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [accessToken, setAccessToken] = useState();
	const [user, setUser] = useState();
	const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
		webClientId:
			"982426357820-kbmhtkccg8ddva3vgifqoipuph1c5323.apps.googleusercontent.com",
		iosClientId:
			"982426357820-ethm62eg90d7irguutgoav9ftojuqlt3.apps.googleusercontent.com",
		androidClientId:
			"982426357820-dr8e4psv4n1nlki8jc73clpq6gc5r388.apps.googleusercontent.com",
		expoClientId: "97cad525-c111-403e-b3db-11692d22f18e",
	});

	const navigation = useNavigation();

	function handleLogin() {
		auth
			.signInWithEmailAndPassword(email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;

				console.log(`Logged in with ${user.email}`);
			})
			.catch((e) => {
				alert(e.message);
			});
	}

	async function fetchUserInfo() {
		const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const userInfo = await response.json();

		const UserModel = {
			notes: [],
		};

		await setDoc(doc(db, "users", userInfo.id), UserModel);

		setUser(userInfo);
	}

	useEffect(() => {
		if (response?.type === "success") {
			setAccessToken(response.authentication.accessToken);
			accessToken && fetchUserInfo();

			console.log(user);
		}
	}, [response, accessToken]);

	return (
		<SafeAreaView style={styles.page}>
			<Text style={styles.heading}>Hello Again!</Text>
			<Text style={styles.subheading}>Welcome back, we really missed you!</Text>

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
			<Pressable>
				<Text style={styles.forgotPass}>Forgot Password</Text>
			</Pressable>

			<Pressable style={styles.loginBtn} onPress={handleLogin}>
				<Text style={styles.loginBtnTxt}>Log In</Text>
			</Pressable>

			<Text style={styles.otherOptionsTxt}>Or continue with</Text>

			<View style={styles.oAuthContainer}>
				<Pressable style={styles.oAuthOption} onPress={promptAsync}>
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
				<Text style={styles.registerInstead}>Not a member? </Text>
				<Pressable onPress={() => navigation.navigate("Register")}>
					<Text style={[styles.registerInstead, styles.registerBtn]}>
						Register now
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
