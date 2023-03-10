import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

export default function Header({ logo, heading, icon1, icon2 }) {
	return (
		<View style={styles.pageHeading}>
			<View style={styles.icon1}>{icon1}</View>
			{logo && <Image style={styles.logo} source={logo} />}
			{heading && <Text style={styles.header}>{heading}</Text>}
			<View style={styles.icon2}>{icon2}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	pageHeading: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 50,
	},
	logo: {
		height: undefined,
		width: "27%",
		aspectRatio: 6.31,
		resizeMode: "contain",
		opacity: 0.8,
	},
	header: {
		fontWeight: "700",
		fontSize: 23,
		color: "#494156",
	},
	icon1: {
		position: "absolute",
		left: 0,
	},
	icon2: {
		position: "absolute",
		right: 0,
	},
});
