import {
	View,
	Text,
	Pressable,
	StyleSheet,
	TextInput,
	Keyboard,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Header from "../../Header";

export default function CreateNote({
	createNote,
	createdNoteContent,
	setCreatedNoteContent,
	createdNoteTitle,
	setCreatedNoteTitle,
	requiresPro,
}) {
	const navigation = useNavigation();
	const [selectedBgOption, setSelectedBgOption] = useState("#F2F8FF");

	useEffect(() => {
		setCreatedNoteTitle("");
		setCreatedNoteContent("");
	}, []);

	return (
		<Pressable onPress={Keyboard.dismiss}>
			<SafeAreaView style={styles.page}>
				<Header
					heading="Create Note"
					icon1={
						<Pressable onPress={navigation.goBack}>
							<AntDesign name="closecircleo" size={25} color="#FC6B68" />
						</Pressable>
					}
					icon2={
						<Pressable
							onPress={() => {
								createNote(
									createdNoteTitle,
									createdNoteContent,
									["Tag1", "Tag2"],
									"20/02/2023",
									selectedBgOption
								);
								navigation.goBack();
							}}
						>
							<AntDesign name="checkcircleo" size={25} color="#FC6B68" />
						</Pressable>
					}
				/>

				<ScrollView automaticallyAdjustKeyboardInsets={true}>
					<View style={styles.editingHeading}>
						<TextInput
							placeholder="Untitled"
							style={styles.editingTitle}
							defaultValue={createdNoteTitle}
							onChangeText={(newTitle) => setCreatedNoteTitle(newTitle)}
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
									selectedBgOption === "#F2F8FF"
										? "black"
										: "rgba(0, 0, 0, .4)",
							}}
						></Pressable>
						<Pressable
							onPress={() => setSelectedBgOption("#FFF6E7")}
							style={{
								...styles.bgColorOption,
								backgroundColor: "#FFF6E7",
								borderWidth: selectedBgOption === "#FFF6E7" ? 2 : 1,
								borderColor:
									selectedBgOption === "#FFF6E7"
										? "black"
										: "rgba(0, 0, 0, .4)",
							}}
						></Pressable>
						<Pressable
							onPress={() => setSelectedBgOption("#E5FFE6")}
							style={{
								...styles.bgColorOption,
								backgroundColor: "#E5FFE6",
								borderWidth: selectedBgOption === "#E5FFE6" ? 2 : 1,
								borderColor:
									selectedBgOption === "#E5FFE6"
										? "black"
										: "rgba(0, 0, 0, .4)",
							}}
						></Pressable>
						<Pressable
							onPress={() => setSelectedBgOption("#F8D7E8")}
							style={{
								...styles.bgColorOption,
								backgroundColor: "#F8D7E8",
								borderWidth: selectedBgOption === "#F8D7E8" ? 2 : 1,
								borderColor:
									selectedBgOption === "#F8D7E8"
										? "black"
										: "rgba(0, 0, 0, .4)",
							}}
						></Pressable>
						<Pressable
							onPress={() => setSelectedBgOption("#F8EFE6")}
							style={{
								...styles.bgColorOption,
								backgroundColor: "#F8EFE6",
								borderWidth: selectedBgOption === "#F8EFE6" ? 2 : 1,
								borderColor:
									selectedBgOption === "#F8EFE6"
										? "black"
										: "rgba(0, 0, 0, .4)",
							}}
						></Pressable>
					</View>
					<TextInput
						placeholder="Start taking notes..."
						style={styles.editingContent}
						multiline={true}
						defaultValue={createdNoteContent}
						onChangeText={(newContent) => setCreatedNoteContent(newContent)}
					/>
				</ScrollView>
				<View style={styles.btnsContainer}>
					<Pressable
						style={styles.generateBtn}
						onPress={() => navigation.navigate("GenerateNote")}
						// onPress={() => navigation.navigate("Paywall")}
					>
						<MaterialIcons name="auto-fix-high" size={24} color="#fff" />
					</Pressable>
					<Pressable
						style={{ ...styles.generateBtn, marginLeft: 20 }}
						onPress={() => navigation.navigate("ScanText")}
					>
						<AntDesign name="scan1" size={24} color="#fff" />
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
	editingHeading: {
		marginBottom: 30,
		paddingBottom: 30,
		borderBottomWidth: 1,
		borderBottomColor: "#FC6B68",
	},
	editingTitle: {
		fontSize: 18,
		fontWeight: "800",
		letterSpacing: 1.3,
	},
	editingContent: {
		fontSize: 15,
		lineHeight: 30,
		fontWeight: "500",
		minWidth: "100%",
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
	btnsContainer: {
		flexDirection: "row",
		backgroundColor: "#ECEAF8",
		position: "absolute",
		bottom: 0,
		right: 20,
		padding: 10,
		borderRadius: 5,
	},
	generateBtn: {
		backgroundColor: "#FC6B68",
		borderRadius: 2.5,
		padding: 15,
	},
});
