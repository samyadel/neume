import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Alert } from "react-native";

import NotesView from "./HomepageScreens/NotesView";
import EditNote from "./HomepageScreens/EditNote";
import CreateNote from "./HomepageScreens/CreateNote";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../../firebaseConfig";
import GenerateNote from "./HomepageScreens/GenerateNote";
import TextScanner from "./HomepageScreens/TextScanner";
import NoteQuetions from "./HomepageScreens/NoteQuestions";
import Paywall from "../Paywall";
import useRevenueCat from "../../../hooks/useRevenueCat";

import uuid from "react-native-uuid";
import Flashcards from "./HomepageScreens/Flashcards";
import ManageFlashcards from "./HomepageScreens/ManageFlashcards";

const Stack = createStackNavigator();

const userRef = firebase.firestore().collection("users");

export default function Homepage({ handleLogOut, tokens, setTokens }) {
	const [clickedNote, setClickedNote] = useState(null);
	const [notes, setNotes] = useState([]);

	const [createdNoteContent, setCreatedNoteContent] = useState("");
	const [createdNoteTitle, setCreatedNoteTitle] = useState("");
	const [noteQuestions, setNoteQuestions] = useState("");
	const [noteContent, setNoteContent] = useState("");
	const [noteTitle, setNoteTitle] = useState("");
	const [loading, setLoading] = useState(false);
	const [flashcardsArr, setFlashcardsArr] = useState([]);

	const { isProMember } = useRevenueCat();

	const navigation = useNavigation();

	const user = firebase.auth().currentUser;

	useEffect(() => {
		userRef.onSnapshot((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (doc.id === user.uid) {
					setNotes(doc.data().notes);
					setTokens(doc.data().tokens);
				}
			});
		});
	}, []);

	function displayQuestions(questions, content, title) {
		setNoteTitle(title);
		setNoteQuestions(questions);
		setNoteContent(content);

		navigation.navigate("Questions");
	}

	function deleteNote(newNotes) {
		userRef.doc(user.uid).update({
			notes: newNotes,
		});

		setNotes(newNotes);
	}

	function favouriteNote(id) {
		const newArr = notes.map((note) =>
			note.id === id ? { ...note, favourite: !note.favourite } : { ...note }
		);

		userRef.doc(user.uid).update({
			notes: newArr,
		});

		setNotes(newArr);
	}

	function saveNote(title, content, bgColor) {
		notes.forEach((note, i) => {
			if (note.id == clickedNote.id) {
				const arr = notes;
				arr.splice(i, 1, {
					...note,
					title,
					content,
					bgColor,
				});

				userRef.doc(user.uid).update({
					notes: arr,
				});
			}
		});
	}

	function saveQuestions(questions) {
		notes.forEach((note, i) => {
			if (note.id == clickedNote.id) {
				const arr = notes;
				arr.splice(i, 1, {
					...clickedNote,
					questions,
				});

				userRef.doc(user.uid).update({
					notes: arr,
				});
			}
		});
	}

	function saveFlashcards(flashcards) {
		notes.forEach((note, i) => {
			if (note.id == clickedNote.id) {
				const arr = notes;
				arr.splice(i, 1, {
					...clickedNote,
					flashcards,
				});

				userRef.doc(user.uid).update({
					notes: arr,
				});
			}
		});
	}

	function createNote(title, content, tags, bgColor) {
		if (title && content) {
			const arr = notes;
			const id = uuid.v4();

			const today = new Date();
			let dd = today.getDate();
			let mm = today.getMonth() + 1;

			const yyyy = today.getFullYear();
			if (dd < 10) {
				dd = "0" + dd;
			}
			if (mm < 10) {
				mm = "0" + mm;
			}

			const date = dd + "/" + mm + "/" + yyyy;

			arr.unshift({
				id,
				title,
				content,
				tags,
				date,
				bgColor,
				favourite: false,
				flashcards: [],
			});

			userRef.doc(user.uid).update({
				notes: arr,
			});

			console.log(arr[arr.length - 1]);

			setNotes(arr);

			return id;
		} else {
			Alert.alert("Missing fields", "Please fill out all fields");
		}
	}

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				cardStyle: {
					backgroundColor: "#FFF",
				},
			}}
		>
			<Stack.Screen name="Dashboard">
				{() => (
					<NotesView
						isProMember={isProMember}
						displayQuestions={displayQuestions}
						favouriteNote={favouriteNote}
						deleteNote={deleteNote}
						handleLogOut={handleLogOut}
						setNotes={setNotes}
						notes={notes}
						tokens={tokens}
						onNotePress={(selectedNoteId) => {
							notes.forEach((note) => {
								if (note.id === selectedNoteId) {
									setClickedNote(note);
								}
							});
						}}
					/>
				)}
			</Stack.Screen>
			<Stack.Screen name="Edit" options={{ presentation: "modal" }}>
				{() => {
					return <EditNote note={clickedNote} saveNote={saveNote} />;
				}}
			</Stack.Screen>
			<Stack.Screen
				name="Flashcards"
				options={{ presentation: "modal", gestureEnabled: !loading }}
			>
				{() => {
					return (
						<Flashcards
							note={clickedNote}
							saveFlashcards={saveFlashcards}
							loading={loading}
							setLoading={setLoading}
							flashcardsArr={flashcardsArr}
							setFlashcardsArr={setFlashcardsArr}
							tokens={tokens}
							setTokens={setTokens}
						/>
					);
				}}
			</Stack.Screen>
			<Stack.Screen name="ManageFlashcards" options={{ presentation: "modal" }}>
				{() => {
					return (
						<ManageFlashcards
							note={clickedNote}
							saveFlashcards={saveFlashcards}
							loading={loading}
							setLoading={setLoading}
							flashcardsArr={flashcardsArr}
							setFlashcardsArr={setFlashcardsArr}
						/>
					);
				}}
			</Stack.Screen>
			<Stack.Screen name="Create" options={{ presentation: "modal" }}>
				{() => {
					return (
						<CreateNote
							isProMember={isProMember}
							createNote={createNote}
							createdNoteContent={createdNoteContent}
							setCreatedNoteContent={setCreatedNoteContent}
							createdNoteTitle={createdNoteTitle}
							setCreatedNoteTitle={setCreatedNoteTitle}
						/>
					);
				}}
			</Stack.Screen>
			<Stack.Screen
				name="Generate"
				options={{ presentation: "modal", gestureEnabled: !loading }}
			>
				{() => {
					return (
						<GenerateNote
							loading={loading}
							setLoading={setLoading}
							createNote={createNote}
							setClickedNote={setClickedNote}
							setCreatedNoteContent={setCreatedNoteContent}
							setCreatedNoteTitle={setCreatedNoteTitle}
							tokens={tokens}
							setTokens={setTokens}
						/>
					);
				}}
			</Stack.Screen>
			<Stack.Screen name="Scan">
				{() => {
					return (
						<TextScanner
							setCreatedNoteContent={setCreatedNoteContent}
							setCreatedNoteTitle={setCreatedNoteTitle}
						/>
					);
				}}
			</Stack.Screen>
			<Stack.Screen name="Questions">
				{() => {
					return (
						<NoteQuetions
							questions={noteQuestions}
							content={noteContent}
							title={noteTitle}
							saveNote={saveQuestions}
						/>
					);
				}}
			</Stack.Screen>
		</Stack.Navigator>
	);
}
