import { View, Text, StyleSheet, Pressable } from "react-native";

export default function ViewOptions({ selectedOption, setSelectedOption }) {
	return (
		<View style={styles.options}>
			<Pressable
				style={[
					styles.option,
					selectedOption === "notes" && styles.selectedOption,
				]}
				onPress={() => setSelectedOption("notes")}
			>
				<Text
					style={[
						styles.optionTitle,
						selectedOption === "notes" && styles.selected,
					]}
				>
					Notes
				</Text>
			</Pressable>
			<Pressable
				style={[
					styles.option,
					selectedOption === "favourites" && styles.selectedOption,
				]}
				onPress={() => setSelectedOption("favourites")}
			>
				<Text
					style={[
						styles.optionTitle,
						selectedOption === "favourites" && styles.selected,
					]}
				>
					Favourites
				</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	options: {
		display: "flex",
		flexDirection: "row",
		backgroundColor: "#ECEAF8",
		padding: 10,
		borderRadius: 10,
		width: "100%",
		justifyContent: "space-around",
		alignItems: "center",
		marginBottom: 30,
	},
	option: {
		borderRadius: 5,
		width: "50%",
		padding: 10,
	},
	optionTitle: {
		fontSize: 16,
		fontWeight: "600",
		width: "100%",
		textAlign: "center",
		color: "#494156",
	},
	selectedOption: {
		backgroundColor: "#FC6B68",
		color: "#FFF",
	},
	selected: {
		color: "#FFF",
		opacity: 1,
	},
});
