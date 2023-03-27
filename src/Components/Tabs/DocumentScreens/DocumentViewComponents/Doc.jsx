import { StyleSheet, Text, View, Pressable, Image, Alert } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

export default function Doc({
	docName,
	docContent,
	docAllChats,
	referencedDoc,
	paraphrasedDoc,
	improvedWork,
	docId,
	openDoc,
	deleteDoc,
}) {
	return (
		<Pressable
			style={styles.docWrapper}
			onPress={() =>
				openDoc(
					docName,
					docContent,
					docId,
					docAllChats,
					referencedDoc,
					paraphrasedDoc,
					improvedWork
				)
			}
		>
			<View style={styles.docImageWrapper}>
				<Pressable
					style={{
						position: "absolute",
						right: 5,
						top: 5,
						opacity: 0.5,
						backgroundColor: "rgba(0, 0, 0, .1)",
						padding: 5,
						borderRadius: 5,
					}}
					onPress={() => {
						Alert.alert(
							"Delete doc?",
							"This action is permanent",
							[
								{
									text: "Delete",
									onPress: async () => {
										deleteDoc(docId);
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
					<Feather name="trash-2" size={22} color="black" />
				</Pressable>
				<Image
					style={styles.docImage}
					source={require("../../../../../assets/txtDocIcon.png")}
				/>
			</View>
			<Text numberOfLines={1} style={styles.docName}>
				{docName}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	docWrapper: {
		width: "30%",
		marginRight: 10,
		marginBottom: 20,
	},
	docImageWrapper: {
		borderWidth: 3,
		borderRadius: 15,
		borderColor: "rgba(0, 0, 0, .2)",
		paddingVertical: 30,
		paddingHorizontal: 15,
		marginBottom: 15,
	},
	docImage: {
		width: "100%",
		height: undefined,
		aspectRatio: 0.95,
	},
	docName: {
		textAlign: "center",
	},
});
