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
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../Header";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

export default function ReferencedDoc({ selectedDoc, loading }) {
	const navigation = useNavigation();
	const [text, setText] = useState("");

	console.log(selectedDoc);

	useEffect(() => {
		if (selectedDoc?.referencedDoc && !loading) {
			setText(selectedDoc.referencedDoc.trim());
		} else if (loading) {
			setText(
				"We're referencing your work. Hang tight, this should only take a few seconds"
			);
		} else {
			setText("Go back, and press 'Go' to add references to your work");
		}
	}, [loading]);

	const throwAlert = () => {
		Alert.alert(
			"Hang tight",
			"We're referencing your work. This should only take a few seconds"
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.page}>
				<Header
					heading="Your work with references"
					icon1={
						<Pressable
							style={styles.returnBtn}
							onPress={loading ? throwAlert : navigation.goBack}
						>
							<Ionicons name="arrow-back" size={25} color="black" />
						</Pressable>
					}
				/>

				{/* <View
					style={{
						flexDirection: "row",
						marginBottom: 20,
						justifyContent: "space-between",
						width: "100%",
					}}
				>
					<Pressable style={styles.button}>
						<Text style={styles.buttonText}>Copy to clipboard</Text>
					</Pressable>

					<Pressable style={styles.button}>
						<Text style={styles.buttonText}>Download</Text>
					</Pressable>
				</View> */}

				<Text style={styles.documentInput}>{text}</Text>
			</ScrollView>
		</SafeAreaView>
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
		// height: "100%",
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
});
