import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";

import ViewOptions from "./NoteViewComponents/ViewOptions";
import Note from "./NoteViewComponents/Note";
import Header from "../../Header";

function BlankPage({ heading, children }) {
	return (
		<View style={styles.noNoteContainer}>
			<Text style={styles.noNoteHeading}>{heading}</Text>
			<Text style={styles.noNoteSubheading}>{children}</Text>
		</View>
	);
}

export default function NotesView({
	onNotePress,
	notes,
	handleLogOut,
	deleteNote,
	favouriteNote,
	displayQuestions,
}) {
	const [selectedOption, setSelectedOption] = useState("notes");
	const navigation = useNavigation();
	const notesScrollRef = useRef();
	const favouritesScrollRef = useRef();

	const [favouriteNoteArr, setFavouriteNoteArr] = useState([]);

	const [clicked, setClicked] = useState(false);

	useEffect(() => {
		notes.forEach((note) => {
			if (note.favourite) {
				setFavouriteNoteArr([...favouriteNoteArr, note.id]);
			}
		});
	}, []);

	const onDismiss = useCallback((note) => {
		const newNotes = notes.filter((item) => {
			if (favouriteNoteArr.indexOf(note.id) !== -1) {
				const arr = [];

				favouriteNoteArr.forEach((el) => {
					if (el !== note.id) {
						arr.push(el);
					}
				});

				setFavouriteNoteArr(arr);
			}
			return item.id !== note.id;
		});

		deleteNote(newNotes);
	});

	const onQuestionShow = useCallback((note) => {
		onNotePress(note.id);
		displayQuestions(note.questions, note.content, note.title);
	});

	const handleFavouriteNoteClick = (id) => {
		console.log(id);

		if (favouriteNoteArr.indexOf(id) !== -1) {
			const arr = [];

			favouriteNoteArr.forEach((el) => {
				if (el !== id) {
					arr.push(el);
				}
			});

			setFavouriteNoteArr(arr);
		} else {
			setFavouriteNoteArr([...favouriteNoteArr, id]);
		}
		favouriteNote(id);
	};

	return (
		<SafeAreaView style={styles.page}>
			<Header
				logo={require("../../../../assets/neumeLogo.png")}
				icon1={
					<Pressable onPress={handleLogOut} style={styles.userAvatar}>
						<MaterialIcons name="logout" size={26} color="black" />
					</Pressable>
				}
				icon2={
					<Pressable
						style={styles.headerBtns}
						onPress={() => navigation.navigate("Create")}
						// setClicked(!clicked)
					>
						<Feather name="plus" size={26} color="#494156" />
					</Pressable>
				}
			/>

			{/* <View style={{ ...styles.createOptions, opacity: clicked ? 1 : 0 }}>
				<Pressable>
					<Text style={styles.createOption}>
						<AntDesign name="addfile" size={24} color="black" /> Create Note
					</Text>
					<Text style={styles.createOption}>Generate Note</Text>
					<Text style={{ ...styles.createOption, marginBottom: 0 }}>
						Scan Note
					</Text>
				</Pressable>
			</View> */}

			<ViewOptions
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
			/>

			<ScrollView
				ref={notesScrollRef}
				style={{
					...styles.displayNotesWrapper,
					display: selectedOption === "notes" ? "flex" : "none",
					width: "100%",
				}}
			>
				{notes.length > 0 ? (
					notes.map((note) => {
						return (
							<Note
								simultaneousHandlers={notesScrollRef}
								onDismiss={onDismiss}
								onPress={() => {
									onNotePress(note.id);
									navigation.navigate("Edit");
								}}
								key={note.id}
								id={note.id}
								note={note}
								favouriteNote={handleFavouriteNoteClick}
								favourite={note.favourite}
								onQuestionShow={onQuestionShow}
							/>
						);
					})
				) : (
					<BlankPage heading="You have no notes">
						Start by pressing <Feather name="plus" size={16} color="#494156" />{" "}
						at the top of your screen
					</BlankPage>
				)}
			</ScrollView>

			<ScrollView
				ref={favouritesScrollRef}
				style={{
					...styles.displayNotesWrapper,
					display: selectedOption === "favourites" ? "flex" : "none",
					width: "100%",
				}}
			>
				{favouriteNoteArr.length > 0 ? (
					notes.map((note) => {
						if (favouriteNoteArr.includes(note.id)) {
							return (
								<Note
									simultaneousHandlers={notesScrollRef}
									onDismiss={onDismiss}
									onPress={() => {
										onNotePress(note.id);
										navigation.navigate("Edit");
									}}
									key={note.id}
									id={note.id}
									note={note}
									favouriteNote={handleFavouriteNoteClick}
									favourite={note.favourite}
									onQuestionShow={onQuestionShow}
								/>
							);
						}
					})
				) : (
					<BlankPage heading={"You have no favourites"}>
						Favourite a note by clicking the{" "}
						<AntDesign name={"star"} size={16} color="#494156" /> button
					</BlankPage>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	createOptions: {
		position: "absolute",
		right: 30,
		top: 80,
		zIndex: 10,
		backgroundColor: "#FFF",
		padding: 20,
		borderRadius: 20,
		shadowOffset: {
			width: 1,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	createOption: {
		backgroundColor: "rgba(0, 0, 0, .04)",
		padding: 10,
		borderRadius: 10,
		marginBottom: 5,
	},
	displayNotesWrapper: {
		height: "100%",
		width: "100%",
	},
	noNoteContainer: {
		opacity: 0.7,
		justifyContent: "center",
		height: 500,
	},
	noNoteHeading: {
		fontWeight: "700",
		fontSize: 25,
		textAlign: "center",
		marginBottom: 15,
		color: "#494156",
	},
	noNoteSubheading: {
		textAlign: "center",
		width: "70%",
		alignSelf: "center",
		fontSize: 17,
		lineHeight: 30,
		opacity: 0.7,
		fontWeight: "500",
		marginBottom: 50,
		color: "#494156",
	},
	page: {
		alignItems: "center",
		marginTop: 40,
		paddingHorizontal: 30,
		width: "100%",
		height: "93.5%",
	},
});
