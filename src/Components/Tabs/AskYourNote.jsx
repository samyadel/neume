import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AskYourNote() {
	return (
		<SafeAreaView style={styles.page}>
			<View style={styles.pageHeading}>
				<Text style={[styles.header, styles.header2]}>
					Talk with your notes
				</Text>
			</View>

			<View style={styles.chatContainer}>
				<View style={[styles.chat, styles.botChat]}>
					<Text>Hey! Please paste the note you want to chat to.</Text>
				</View>

				<View style={[styles.chat, styles.userChat]}>
					<Text>Here it is:</Text>
				</View>
			</View>
		</SafeAreaView>
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
		justifyContent: "center",
	},
	header: {
		fontWeight: "800",
		fontSize: 23,
		marginBottom: 50,
	},
	header2: {
		fontWeight: "700",
	},
	chatContainer: {
		width: "100%",
	},
	chat: {
		backgroundColor: "#E8E9EB",
		padding: 20,
		borderRadius: 15,
		maxWidth: "75%",
	},
	userChat: {
		backgroundColor: "#047DFF ",
	},
});
