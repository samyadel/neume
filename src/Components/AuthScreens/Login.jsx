import {
	View,
	Text,
	Pressable,
	StyleSheet,
	Image,
	Alert,
	useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import firebase from "../../../firebaseConfig";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

import { ScaledSheet } from "react-native-size-matters";

export default function Login() {
	WebBrowser.maybeCompleteAuthSession();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [accessToken, setAccessToken] = useState();
	const [isAppleLoginAvailable, setIsAppleLoginAvailable] = useState(false);

	const { fontScale, scale, width, height } = useWindowDimensions();
	const styles = makeStyles(fontScale, width);

	const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
		webClientId:
			"982426357820-sm6cuv286m5kpi2pl07mor7amdlqmi99.apps.googleusercontent.com",
		iosClientId:
			"982426357820-j2d4t0kn18lsdgk4v9chnplditnvusdp.apps.googleusercontent.com",
		androidClientId:
			"982426357820-7pvvd4h1qu04tqtb38jh2rqd7lto2fqo.apps.googleusercontent.com",
		expoClientId:
			"982426357820-b5653f7egqbes846scvouecf7nt4pu0h.apps.googleusercontent.com",
		scopes: [
			"profile",
			"email",
			"openid",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		],
	});

	const navigation = useNavigation();

	function handleLogin() {
		if (email && password) {
			auth
				.signInWithEmailAndPassword(email, password)
				.then((userCredentials) => {
					const user = userCredentials.user;

					console.log(`Logged in with ${user.email}`);
				})
				.catch((e) => {
					alert(e.message);
				});
		} else {
			Alert.alert("Missing fields", "Please fill out all fields");
		}
	}

	const signInWithApple = async () => {
		const nonce = Math.random().toString(36).substring(2, 10);

		return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
			.then((hashedNonce) =>
				AppleAuthentication.signInAsync({
					requestedScopes: [
						AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
						AppleAuthentication.AppleAuthenticationScope.EMAIL,
					],
					nonce: hashedNonce,
				})
			)
			.then((appleCredential) => {
				const { identityToken } = appleCredential;
				const provider = new firebase.auth.OAuthProvider("apple.com");
				const credential = provider.credential({
					idToken: identityToken,
					rawNonce: nonce,
				});
				return firebase
					.auth()
					.signInWithCredential(credential)
					.then(async (res) => {
						const userInfo = res.user;
						console.log(userInfo);

						const userRef = doc(db, "users", userInfo.uid);
						const user = await getDoc(userRef);

						console.log(user);

						if (!user.exists()) {
							const UserModel = {
								notes: [],
								smartDocs: [],
								username: userInfo.displayName,
								tokens: 10,
							};

							await setDoc(doc(db, "users", userInfo.uid), UserModel);
						}
					});
				// Successful sign in is handled by firebase.auth().onAuthStateChanged
			})
			.catch((error) => {
				// ...
				console.log(error);
			});
	};

	useEffect(() => {
		AppleAuthentication.isAvailableAsync().then(setIsAppleLoginAvailable);
	}, []);

	useEffect(() => {
		if (response?.type === "success") {
			console.log("SUCCESS!");
			setAccessToken(response.authentication.accessToken);

			const credential = firebase.auth.GoogleAuthProvider.credential(
				response.authentication.idToken,
				response.authentication.accessToken
			);

			firebase
				.auth()
				.signInWithCredential(credential)
				.then(async (res) => {
					const userInfo = res.user;
					console.log(userInfo);

					const userRef = doc(db, "users", userInfo.uid);
					const user = await getDoc(userRef);

					console.log(user);

					if (!user.exists()) {
						const UserModel = {
							notes: [],
							smartDocs: [],
							username: userInfo.displayName,
							tokens: 10,
						};

						await setDoc(doc(db, "users", userInfo.uid), UserModel);
					}
				})
				.catch((e) => console.log(e));
		}
	}, [response]);

	return (
		<ScrollView style={{ backgroundColor: "#ECEAF8" }}>
			<SafeAreaView style={styles.page}>
				<Text style={styles.heading}>Hello Again!</Text>
				<Text style={styles.subheading}>
					Welcome back, we really missed you!
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
					// keyboardType="visible-password"
					value={password}
					onChangeText={(text) => setPassword(text)}
				/>
				<Pressable onPress={() => navigation.navigate("ForgotPassword")}>
					<Text style={styles.forgotPass}>Forgot Password</Text>
				</Pressable>

				<Pressable style={styles.loginBtn} onPress={handleLogin}>
					<Text style={styles.loginBtnTxt}>Log In</Text>
				</Pressable>

				<Text style={styles.otherOptionsTxt}>Or continue with</Text>

				<View style={styles.oAuthContainer}>
					<Pressable
						style={styles.oAuthOption}
						onPress={() =>
							promptAsync({ useProxy: false, showInRecents: true })
						}
					>
						<Image
							style={styles.oAuthLogo}
							source={require("../../../assets/googleLogo.png")}
						/>
					</Pressable>
					{isAppleLoginAvailable && (
						<Pressable onPress={signInWithApple} style={styles.oAuthOption}>
							<Image
								style={styles.oAuthLogo}
								source={require("../../../assets/appleLogo.png")}
							/>
						</Pressable>
					)}
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
		</ScrollView>
		// <SafeAreaView style={{ flex: 1 }}>
		// 	<ScrollView contentContainerStyle={styles.page}>
		// 		{/* <SafeAreaView style={styles.page}> */}
		// 		<Text style={styles.heading}>Hello Again!</Text>
		// 		<Text style={styles.subheading}>
		// 			Welcome back, we really missed you!
		// 		</Text>

		// 		<TextInput
		// 			style={styles.input}
		// 			placeholder="Enter email"
		// 			keyboardType="email-address"
		// 			value={email}
		// 			onChangeText={(text) => setEmail(text)}
		// 		/>
		// 		<TextInput
		// 			style={styles.input}
		// 			placeholder="Password"
		// 			// keyboardType="visible-password"
		// 			value={password}
		// 			onChangeText={(text) => setPassword(text)}
		// 		/>
		// 		<Pressable onPress={() => navigation.navigate("ForgotPassword")}>
		// 			<Text style={styles.forgotPass}>Forgot Password</Text>
		// 		</Pressable>

		// 		<Pressable style={styles.loginBtn} onPress={handleLogin}>
		// 			<Text style={styles.loginBtnTxt}>Log In</Text>
		// 		</Pressable>

		// 		<Text style={styles.otherOptionsTxt}>Or continue with</Text>

		// 		<View style={styles.oAuthContainer}>
		// 			<Pressable
		// 				style={styles.oAuthOption}
		// 				onPress={() =>
		// 					promptAsync({ useProxy: false, showInRecents: true })
		// 				}
		// 			>
		// 				<Image
		// 					style={styles.oAuthLogo}
		// 					source={require("../../../assets/googleLogo.png")}
		// 				/>
		// 			</Pressable>
		// 			{isAppleLoginAvailable && (
		// 				<Pressable onPress={signInWithApple} style={styles.oAuthOption}>
		// 					<Image
		// 						style={styles.oAuthLogo}
		// 						source={require("../../../assets/appleLogo.png")}
		// 					/>
		// 				</Pressable>
		// 			)}
		// 		</View>

		// 		<View style={styles.registerInsteadContainer}>
		// 			<Text style={styles.registerInstead}>Not a member? </Text>
		// 			<Pressable onPress={() => navigation.navigate("Register")}>
		// 				<Text style={[styles.registerInstead, styles.registerBtn]}>
		// 					Register now
		// 				</Text>
		// 			</Pressable>
		// 		</View>
		// 		{/* </SafeAreaView> */}
		// 	</ScrollView>
		// </SafeAreaView>
	);
}

const makeStyles = (fontScale) =>
	StyleSheet.create({
		page: {
			padding: 30,
			paddingTop: 90,
			backgroundColor: "#ECEAF8",
			flex: 1,
		},
		heading: {
			fontWeight: "700",
			fontSize: 30 / fontScale,
			textAlign: "center",
			marginBottom: 30,
			color: "#494156",
		},
		subheading: {
			textAlign: "center",
			width: "70%",
			alignSelf: "center",
			fontSize: 20 / fontScale,
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
			fontSize: 16 / fontScale,
			fontWeight: "700",
		},
		forgotPass: {
			textAlign: "right",
			fontWeight: "700",
			fontSize: 15 / fontScale,
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
			fontSize: 18 / fontScale,
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

// const styles = ScaledSheet.create({
// 	// page: {
// 	// 	padding: 30,
// 	// 	paddingTop: 90,
// 	// 	backgroundColor: "#ECEAF8",
// 	// 	flex: 1,
// 	// },
// 	page: {
// 		padding: "30@mvs",
// 		paddingVertical: "80@mvs",
// 		backgroundColor: "#ECEAF8",
// 		flex: 1,
// 		justifyContent: "space-evenly",
// 	},
// 	heading: {
// 		fontWeight: "700",
// 		fontSize: "30@mvs",
// 		textAlign: "center",
// 		marginBottom: "30@mvs",
// 		color: "#494156",
// 	},
// 	subheading: {
// 		textAlign: "center",
// 		// width: "70%",
// 		width: "250@mvs",
// 		alignSelf: "center",
// 		fontSize: "20@mvs",
// 		lineHeight: "30@mvs",
// 		opacity: 0.7,
// 		fontWeight: "500",
// 		marginBottom: "50@mvs",
// 		color: "#494156",
// 	},
// 	input: {
// 		backgroundColor: "#FFF",
// 		padding: "20@mvs",
// 		borderRadius: 12,
// 		marginBottom: "22@mvs",
// 		fontSize: "16@mvs",
// 		fontWeight: "700",
// 	},
// 	forgotPass: {
// 		textAlign: "right",
// 		fontWeight: "700",
// 		fontSize: "15@mvs",
// 		marginBottom: "40@mvs",
// 		marginTop: "10@mvs",
// 		color: "#494156",
// 	},
// 	loginBtn: {
// 		backgroundColor: "#FC6B68",
// 		padding: "22@mvs",
// 		borderRadius: 12,
// 	},
// 	loginBtnTxt: {
// 		color: "#FFF",
// 		fontWeight: "700",
// 		textAlign: "center",
// 		fontSize: "18@mvs",
// 	},
// 	otherOptionsTxt: {
// 		marginVertical: "45@mvs",
// 		textAlign: "center",
// 		color: "#494156",
// 		fontWeight: "600",
// 	},
// 	oAuthContainer: {
// 		flexDirection: "row",
// 		justifyContent: "space-evenly",
// 		marginBottom: "50@mvs",
// 	},
// 	oAuthOption: {
// 		width: "30%",
// 		height: "65@mvs",
// 		borderWidth: 3,
// 		borderColor: "#FFF",
// 		borderRadius: 10,
// 		padding: "14@mvs",
// 	},
// 	oAuthLogo: {
// 		height: "100%",
// 		width: undefined,
// 		aspectRatio: 1,
// 		resizeMode: "contain",
// 		alignSelf: "center",
// 		opacity: 0.8,
// 	},
// 	registerInsteadContainer: {
// 		flexDirection: "row",
// 		justifyContent: "center",
// 	},
// 	registerInstead: {
// 		textAlign: "center",
// 		fontWeight: "500",
// 		justifyContent: "center",
// 		alignItems: "center",
// 		flexDirection: "row",
// 		marginRight: "3@mvs",
// 	},
// 	registerBtn: {
// 		color: "#3E85DF",
// 	},
// });
