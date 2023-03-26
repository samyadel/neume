import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../../firebaseConfig";
import { ScrollView } from "react-native-gesture-handler";

export default function GetStarted() {
	const navigation = useNavigation();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				navigation.reset({
					index: 0,
					routes: [{ name: "Homepage" }],
				});
			}
		});

		return unsubscribe;
	}, []);

	return (
		<ScrollView style={{ backgroundColor: "#ECEAF8" }}>
			<SafeAreaView style={styles.page}>
				<View style={styles.illustrationContainer}>
					<Image
						style={styles.illustration}
						source={require("../../../assets/illustration.png")}
					/>
				</View>
				<Text style={styles.heading}>Get the Grades You Deserve</Text>
				<Text style={styles.subheading}>
					Let Neume handle the long, useless tasks. You focus on the important
					stuff
				</Text>

				<View style={styles.btnsWrapper}>
					<Pressable
						style={[styles.authOptionBtn, styles.loginBtn]}
						onPress={() => navigation.navigate("Login")}
					>
						<View style={styles.txtContainer}>
							<Text style={styles.btnTxt}>Log in</Text>
						</View>
					</Pressable>
					<Pressable
						style={[styles.authOptionBtn, styles.registerBtn]}
						onPress={() => navigation.navigate("Register")}
					>
						<Text style={styles.btnTxt}>Register</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	page: {
		padding: 30,
		backgroundColor: "#ECEAF8",
		flex: 1,
	},
	illustrationContainer: {
		width: "100%",
		height: 370,
		borderRadius: 30,
		backgroundColor: "#FC6B68AA",
		borderWidth: 7,
		borderColor: "#FFF",
		padding: 40,
		marginBottom: 70,
	},
	illustration: {
		width: "100%",
		height: undefined,
		aspectRatio: 1,
		resizeMode: "contain",
	},
	heading: {
		fontWeight: "700",
		fontSize: 30,
		alignSelf: "center",
		width: "60%",
		textAlign: "center",
		marginBottom: 30,
	},
	subheading: {
		textAlign: "center",
		width: "80%",
		alignSelf: "center",
		fontSize: 16,
		lineHeight: 25,
		opacity: 0.7,
		fontWeight: "500",
		marginBottom: 90,
	},
	btnsWrapper: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "flex-start",
	},
	authOptionBtn: {
		borderWidth: 2,
		borderColor: "#FFF",
		padding: 20,
		borderRadius: 15,
		width: "50%",
	},
	registerBtn: {
		backgroundColor: "#FFF",
	},
	loginBtn: {
		width: "100%",
		position: "absolute",
		right: 0,
	},
	txtContainer: {
		width: "50%",
		alignSelf: "flex-end",
	},
	btnTxt: {
		textAlign: "center",
		fontWeight: "500",
		fontSize: 17,
	},
});
