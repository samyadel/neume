import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NotesView from "./HomepageScreens/NotesView";
import EditNote from "./HomepageScreens/EditNote";
import CreateNote from "./HomepageScreens/CreateNote";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../../firebaseConfig";
import GenerateNote from "./HomepageScreens/GenerateNote";
import TextScanner from "./HomepageScreens/TextScanner";
import NoteQuetions from "./HomepageScreens/NoteQuestions";
import Paywall from "./HomepageScreens/Paywall";

import uuid from "react-native-uuid";

const Stack = createStackNavigator();

const userRef = firebase.firestore().collection("users");

export default function Homepage({ handleLogOut }) {
	const [clickedNote, setClickedNote] = useState(null);
	const [notes, setNotes] = useState([]);
	const [createdNoteContent, setCreatedNoteContent] = useState("");
	const [createdNoteTitle, setCreatedNoteTitle] = useState("");
	const [noteQuestions, setNoteQuestions] = useState("");
	const [noteContent, setNoteContent] = useState("");
	const [noteTitle, setNoteTitle] = useState("");

	const navigation = useNavigation();

	const user = firebase.auth().currentUser;

	useEffect(() => {
		userRef.onSnapshot((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (doc.id === user.uid) {
					setNotes(doc.data().notes);
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
					...clickedNote,
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

	function createNote(title, content, tags, date, bgColor) {
		const arr = notes;
		arr.unshift({
			id: uuid.v4(),
			title,
			content,
			tags,
			date,
			bgColor,
			favourite: false,
			questions: "",
		});

		userRef.doc(user.uid).update({
			notes: arr,
		});

		setNotes(arr);
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
						displayQuestions={displayQuestions}
						favouriteNote={favouriteNote}
						deleteNote={deleteNote}
						handleLogOut={handleLogOut}
						setNotes={setNotes}
						notes={notes}
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
			<Stack.Screen name="Create">
				{() => {
					return (
						<CreateNote
							createNote={createNote}
							createdNoteContent={createdNoteContent}
							setCreatedNoteContent={setCreatedNoteContent}
							createdNoteTitle={createdNoteTitle}
							setCreatedNoteTitle={setCreatedNoteTitle}
						/>
					);
				}}
			</Stack.Screen>
			<Stack.Screen name="GenerateNote" options={{ presentation: "modal" }}>
				{() => {
					return (
						<GenerateNote
							setCreatedNoteContent={setCreatedNoteContent}
							setCreatedNoteTitle={setCreatedNoteTitle}
						/>
					);
				}}
			</Stack.Screen>
			<Stack.Screen name="ScanText">
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
			<Stack.Screen
				name="Paywall"
				component={Paywall}
				options={{ presentation: "modal" }}
			/>
		</Stack.Navigator>
	);
}
