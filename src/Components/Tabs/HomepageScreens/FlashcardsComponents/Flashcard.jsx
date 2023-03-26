import {
	View,
	Text,
	Pressable,
	StyleSheet,
	Animated,
	Easing,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";

export default function Flashcard({ flashcard, index, deleteFlashcard }) {
	const [flip, setFlip] = useState(false);
	const spinValue = useRef(new Animated.Value(0)).current;

	const flipCard = () => {
		const flipVal = !flip;
		setFlip(flipVal);
		if (flipVal) {
			flipAnim(1);
		} else {
			flipAnim(0);
		}
	};

	const flipAnim = (val) => {
		Animated.timing(spinValue, {
			toValue: val,
			duration: 200,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start();
	};

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "180deg"],
	});

	return (
		<Pressable onPress={flipCard}>
			<Animated.View
				style={[styles.flashcard, { transform: [{ rotateY: spin }] }]}
			>
				{/* <Pressable
					style={{
						position: "absolute",
						right: 10,
						top: 10,
						opacity: 0.5,
						backgroundColor: "rgba(0, 0, 0, .1)",
						padding: 5,
						borderRadius: 5,
					}}
					onPress={() => deleteFlashcard(index)}
				>
					<Feather name="trash-2" size={22} color="black" />
				</Pressable> */}
				<View style={[styles.front, { opacity: flip ? 0 : 1 }]}>
					<Text style={styles.flashcardText}>{flashcard.front}</Text>
				</View>

				<View style={[styles.back, { opacity: flip ? 1 : 0 }]}>
					<Text style={styles.flashcardText}>{flashcard.back}</Text>
				</View>
			</Animated.View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	flashcard: {
		// alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		borderRadius: 5,
		marginVertical: 10,
		minHeight: 250,
		padding: 50,
		marginLeft: 25,
		marginRight: 25,
		shadowColor: "#171717",
		shadowOffset: { width: -2, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 3,
		backgroundColor: "#fff",
	},
	front: {
		position: "absolute",
		textAlign: "center",
	},
	back: {
		// position: "absolute",
		textAlign: "center",
		transform: [{ rotateY: "180deg" }],
	},
	flashcardText: {
		fontSize: 18,
	},
});
