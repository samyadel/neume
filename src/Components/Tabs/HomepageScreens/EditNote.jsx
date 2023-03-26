import {
	View,
	Text,
	Pressable,
	StyleSheet,
	TextInput,
	Keyboard,
	ScrollView,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
// import { ScrollView } from "react-native-gesture-handler";
import Header from "../../Header";

export default function EditNote({ note, saveNote }) {
	const { title, content, bgColor } = note;

	const navigation = useNavigation();
	const [noteTitle, setNoteTitle] = useState(title);
	const [noteContent, setNoteContent] = useState(content);
	const [selectedBgOption, setSelectedBgOption] = useState(bgColor);

	return (
		// <View style={{ height: "100%" }}>
		// <Pressable onPress={() => Keyboard.dismiss()}>
		<SafeAreaView style={styles.page}>
			<Header
				heading="Edit Note"
				icon1={
					<Pressable onPress={navigation.goBack}>
						<AntDesign name="closecircleo" size={25} color="#FC6B68" />
					</Pressable>
				}
				icon2={
					<Pressable
						onPress={() => {
							if (noteTitle && noteContent) {
								saveNote(noteTitle, noteContent, selectedBgOption);
								navigation.goBack();
							} else {
								Alert.alert("Missing fields", "Please fill out all fields");
							}
						}}
					>
						<AntDesign name="checkcircleo" size={25} color="#FC6B68" />
					</Pressable>
				}
			/>

			<ScrollView
				automaticallyAdjustKeyboardInsets={true}
				// scrollToOverflowEnabled={true}
				scrollsToTop={true}
				keyboardDismissMode="interactive"
			>
				<View style={styles.editingHeading}>
					<TextInput
						style={styles.editingTitle}
						defaultValue={title}
						onChangeText={(newTitle) => setNoteTitle(newTitle)}
					/>
				</View>

				<View style={styles.bgColorOptions}>
					<Pressable
						onPress={() => setSelectedBgOption("#F2F8FF")}
						style={{
							...styles.bgColorOption,
							backgroundColor: "#F2F8FF",
							borderWidth: selectedBgOption === "#F2F8FF" ? 2 : 1,
							borderColor:
								selectedBgOption === "#F2F8FF" ? "black" : "rgba(0, 0, 0, .4)",
						}}
					></Pressable>
					<Pressable
						onPress={() => setSelectedBgOption("#FFF6E7")}
						style={{
							...styles.bgColorOption,
							backgroundColor: "#FFF6E7",
							borderWidth: selectedBgOption === "#FFF6E7" ? 2 : 1,
							borderColor:
								selectedBgOption === "#FFF6E7" ? "black" : "rgba(0, 0, 0, .4)",
						}}
					></Pressable>
					<Pressable
						onPress={() => setSelectedBgOption("#E5FFE6")}
						style={{
							...styles.bgColorOption,
							backgroundColor: "#E5FFE6",
							borderWidth: selectedBgOption === "#E5FFE6" ? 2 : 1,
							borderColor:
								selectedBgOption === "#E5FFE6" ? "black" : "rgba(0, 0, 0, .4)",
						}}
					></Pressable>
					<Pressable
						onPress={() => setSelectedBgOption("#F8D7E8")}
						style={{
							...styles.bgColorOption,
							backgroundColor: "#F8D7E8",
							borderWidth: selectedBgOption === "#F8D7E8" ? 2 : 1,
							borderColor:
								selectedBgOption === "#F8D7E8" ? "black" : "rgba(0, 0, 0, .4)",
						}}
					></Pressable>
					<Pressable
						onPress={() => setSelectedBgOption("#F8EFE6")}
						style={{
							...styles.bgColorOption,
							backgroundColor: "#F8EFE6",
							borderWidth: selectedBgOption === "#F8EFE6" ? 2 : 1,
							borderColor:
								selectedBgOption === "#F8EFE6" ? "black" : "rgba(0, 0, 0, .4)",
						}}
					></Pressable>
				</View>

				<TextInput
					onStartShouldSetResponder={() => false}
					style={styles.editingContent}
					multiline={true}
					scrollEnabled={false}
					defaultValue={noteContent}
					onChangeText={(newContent) => setNoteContent(newContent)}
				/>
				{/* <Text style={styles.editingContent}>{noteContent}</Text> */}
			</ScrollView>
		</SafeAreaView>
		// </Pressable>
		// </View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		flex: 1,
		top: 0,
		left: 0,
		backgroundColor: "rgba(0, 0, 0, .25)",
		zIndex: 10,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	loadingContainer: {
		backgroundColor: "#FFF",
		padding: 25,
		borderRadius: 10,
	},
	loadingTxt: {
		fontSize: 16,
		fontWeight: "600",
		letterSpacing: 1,
	},
	page: {
		alignItems: "center",
		// marginTop: 40,
		paddingHorizontal: 30,
		width: "100%",
		height: "100%",
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
	editingHeading: {
		marginBottom: 30,
		borderBottomWidth: 1,
		borderBottomColor: "#FC6B68",
	},
	editingTitle: {
		fontSize: 18,
		fontWeight: "800",
		letterSpacing: 1.3,
		marginBottom: 25,
	},
	editingContent: {
		fontSize: 15,
		lineHeight: 30,
		fontWeight: "500",
		minWidth: "100%",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		opacity: 0.4,
	},
	tags: {
		flexDirection: "row",
	},
	tag: {
		marginRight: 10,
	},
	btnsContainer: {
		flexDirection: "row",
		backgroundColor: "#ECEAF8",
		position: "absolute",
		bottom: 0,
		right: 20,
		padding: 10,
		borderRadius: 5,
	},
	scanBtn: {
		backgroundColor: "#FC6B68",
		borderRadius: 2.5,
		padding: 15,
	},
	questionsContainer: {
		backgroundColor: "#ECEAF8",
		borderRadius: 10,
		padding: 20,
		marginVertical: 40,
	},
	questions: {
		color: "#494156",
		fontWeight: "500",
		letterSpacing: 1,
	},
	bgColorOptions: {
		flexDirection: "row",
		marginBottom: 20,
	},
	bgColorOption: {
		width: 35,
		height: 35,
		borderRadius: 5,
		backgroundColor: "#000",
		marginRight: 10,
	},
});
