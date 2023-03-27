import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	AntDesign,
	Feather,
	MaterialIcons,
	FontAwesome,
	MaterialCommunityIcons,
} from "@expo/vector-icons";

import ViewOptions from "./NoteViewComponents/ViewOptions";
import Note from "./NoteViewComponents/Note";
import Header from "../../Header";
import useRevenueCat from "../../../../hooks/useRevenueCat";

import * as Haptics from "expo-haptics";

// import * as functions from "firebase-functions";

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
	tokens,
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

	const { isProMember } = useRevenueCat();

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
		<ScrollView ref={notesScrollRef}>
			<SafeAreaView style={styles.page}>
				<Pressable
					onPress={() => setClicked(false)}
					style={{
						display: clicked ? "flex" : "none",
						// backgroundColor: "#000",
						// opacity: 0.5,
						width: "100%",
						height: "200%",
						position: "absolute",
						top: 0,
						left: 0,
						zIndex: 5,
					}}
				></Pressable>

				<View
					style={{
						...styles.createOptions,
						display: clicked ? "flex" : "none",
					}}
				>
					<Pressable>
						<Pressable
							style={styles.createOption}
							onPress={() => {
								navigation.navigate("Create");
								setClicked(false);
							}}
						>
							<AntDesign
								name="addfile"
								size={16}
								color="black"
								style={styles.actionIcon}
							/>
							<Text>Write a note</Text>
						</Pressable>
						<Pressable
							style={{ ...styles.createOption, marginBottom: 0 }}
							onPress={() => {
								navigation.navigate("Generate");
								setClicked(false);
							}}
						>
							<MaterialIcons
								name="auto-fix-high"
								size={16}
								color="black"
								style={styles.actionIcon}
							/>
							<Text>Generate a note</Text>
						</Pressable>
						{/* <Pressable
							style={{ ...styles.createOption, marginBottom: 0 }}
							onPress={() => {
								navigation.navigate("Scan");
								setClicked(false);
							}}
						>
							<AntDesign
								name="scan1"
								size={16}
								color="black"
								style={styles.actionIcon}
							/>
							<Text>Scan Note</Text>
						</Pressable> */}
					</Pressable>
				</View>

				{/* <ScrollView contentContainerStyle={styles.page}> */}
				<Header
					logo={
						<Image
							style={{
								...styles.logo,
								aspectRatio: isProMember ? 7.63 : 6.31,
								width: isProMember ? "34%" : "27%",
							}}
							source={
								isProMember
									? require("../../../../assets/neumeProLogo.png")
									: require("../../../../assets/neumeLogo.png")
							}
						/>
					}
					icon1={
						<Pressable
							onPress={() => navigation.navigate("Paywall")}
							// style={styles.userAvatar}
							style={{
								...styles.userTokens,
								backgroundColor: "#ECEAF8",
								paddingVertical: 7,
								paddingHorizontal: 10,
								borderRadius: 10,
							}}
						>
							<FontAwesome
								name="ticket"
								size={24}
								color="#F86968"
								style={{ marginRight: 10 }}
							/>
							{isProMember ? (
								<MaterialCommunityIcons
									name="infinity"
									size={24}
									color="black"
								/>
							) : (
								<Text style={{ fontSize: 16, fontWeight: "500" }}>
									{tokens}
								</Text>
							)}
							{/* <MaterialIcons name="logout" size={26} color="black" /> */}
							{/* <MaterialIcons name="account-circle" size={32} color="black" /> */}
						</Pressable>
					}
					icon2={
						<Pressable
							style={styles.headerBtns}
							onPress={() => setClicked(!clicked)}
							// navigation.navigate("Create")
						>
							<Feather name="plus" size={26} color="#494156" />
						</Pressable>
					}
				/>

				<ViewOptions
					selectedOption={selectedOption}
					setSelectedOption={setSelectedOption}
				/>

				<View
					style={{
						...styles.displayNotesWrapper,
						display: selectedOption === "notes" ? "flex" : "none",
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
									onLongPress={() => {
										onNotePress(note.id);
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
										navigation.navigate("Flashcards");
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
						<BlankPage heading="You have no notes" styles={styles}>
							Start by pressing{" "}
							<Feather name="plus" size={16} color="#494156" /> at the top of
							your screen
						</BlankPage>
					)}
				</View>

				<View
					ref={favouritesScrollRef}
					style={{
						...styles.displayNotesWrapper,
						display: selectedOption === "favourites" ? "flex" : "none",
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
										onLongPress={() => {
											onNotePress(note.id);
											navigation.navigate("Flashcards");
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
				</View>
				{/* </ScrollView> */}
			</SafeAreaView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	userTokens: {
		flexDirection: "row",
		alignItems: "center",
	},
	logo: {
		height: undefined,
		resizeMode: "contain",
		opacity: 0.8,
	},
	actionIcon: {
		marginRight: 12,
	},
	createOptions: {
		position: "absolute",
		right: 30,
		top: 120,
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
		// backgroundColor: "rgba(0, 0, 0, .04)",
		padding: 10,
		paddingLeft: 5,
		borderRadius: 10,
		marginBottom: 5,
		// backgroundColor: "red",
		// justifyContent: "space-between",
		flexDirection: "row",
	},
	displayNotesWrapper: {
		height: "50%",
		// backgroundColor: "green",
		width: "100%",
		// backgroundColor: "red",
		// justifyContent: notes.length > 0 ? "flex-start" : "center",
	},
	noNoteContainer: {
		opacity: 0.7,
		justifyContent: "center",
		// backgroundColor: "blue",
	},
	noNoteHeading: {
		fontWeight: "700",
		fontSize: 25,
		textAlign: "center",
		marginBottom: 15,
		color: "#494156",
		marginTop: 80,
	},
	noNoteSubheading: {
		textAlign: "center",
		width: "70%",
		alignSelf: "center",
		fontSize: 17,
		lineHeight: 30,
		opacity: 0.7,
		fontWeight: "500",
		color: "#494156",
	},
	page: {
		// alignItems: "center",
		paddingTop: 40,
		paddingHorizontal: 30,
		// width: "100%",
		// height: "93.5%",
		// flex: 1,
		// backgroundColor: "red",
		height: "100%",
		// flex: 1,
	},
});
