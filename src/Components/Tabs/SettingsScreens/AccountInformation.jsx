import {
	View,
	Text,
	StyleSheet,
	Keyboard,
	Pressable,
	TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { auth } from "../../../../firebaseConfig";

export default function AccountInformation() {
	const navigation = useNavigation();

	const [email, setEmail] = useState(auth.currentUser.email);

	return (
		<Pressable onPress={Keyboard.dismiss}>
			<SafeAreaView style={styles.page}>
				<View style={styles.pageHeading}>
					<Pressable onPress={navigation.goBack}>
						<AntDesign name="closecircleo" size={25} color="#FC6B68" />
					</Pressable>
					<Text style={[styles.header, styles.header2]}>
						Update Information
					</Text>
					<Pressable>
						<AntDesign name="infocirlceo" size={25} color="#FC6B68" />
					</Pressable>
				</View>

				<View style={styles.inputContainer}>
					<TextInput
						style={styles.generateOption}
						placeholder={"New email"}
						defaultValue={auth.currentUser.email}
						keyboardType="email-address"
						onChangeText={(email) => setEmail(email)}
					/>
					<TextInput
						style={styles.generateOption}
						placeholder="Password"
						keyboardType="visible-password"
					/>
					<Pressable
						style={styles.button}
						onPress={() =>
							auth.currentUser.email !== email &&
							auth.currentUser.updateEmail(email)
						}
					>
						<Text style={styles.buttonText}>Update Account</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		</Pressable>
	);
}

const styles = StyleSheet.create({
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
