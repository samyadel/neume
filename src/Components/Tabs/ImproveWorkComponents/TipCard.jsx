import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

export default function TipCard({ tip, selectedTips, setSelectedTips, id }) {
	const [selected, setSelected] = useState(false);
	const [opacity, setOpacity] = useState("0.01");

	useEffect(() => {
		if (selectedTips.length === 0) {
			setSelected(false);
		}
	}, [selectedTips]);

	return (
		<Pressable
			style={{
				...styles.tipWrapper,
				backgroundColor: selected ? "rgba(0, 0, 0, .08)" : "rgba(0, 0, 0, .01)",
			}}
			onPress={() => {
				setSelected(!selected);
				const arr = [...selectedTips];
				// const tipObj = { id, ...tip };
				let index;

				if (!selected) {
					// arr.push(tipObj);
					arr.push(tip.tip);
					// index = arr.indexOf(tipObj);
					index = arr.indexOf(tip.tip);
					setSelectedTips(arr);
				} else {
					arr.splice(index, 1);
					setSelectedTips(arr);
				}
			}}
		>
			<Text style={styles.tipText}>{tip.tip}</Text>
			<Text>{tip.example}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	tipWrapper: {
		marginBottom: 25,
		borderWidth: 4,
		borderColor: "rgba(0, 0, 0, .05)",
		padding: 20,
		borderRadius: 15,
		width: 300,
		marginRight: 15,
	},
	tipText: {
		fontWeight: "700",
		marginBottom: 10,
		fontSize: 15,
	},
});
