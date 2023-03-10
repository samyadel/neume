import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

export default function LoadingCard({ isLoading, loadingText, width }) {
	const [ellipsis, setEllipsis] = useState("");

	useEffect(() => {
		const ellipsisInterval = setInterval(() => {
			ellipsis.length === 3 ? setEllipsis("") : setEllipsis(ellipsis + ".");
		}, 500);

		return () => {
			clearInterval(ellipsisInterval);
		};
	});

	return (
		<View style={{ ...styles.overlay, display: isLoading ? "flex" : "none" }}>
			<View style={{ ...styles.loadingContainer, width }}>
				<Text style={styles.loadingTxt}>
					{loadingText}
					{ellipsis}
				</Text>
				<Text style={styles.timeWarning}>This may take a minute</Text>
			</View>
		</View>
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
		textAlign: "center",
		marginBottom: 10,
	},
	timeWarning: {
		textAlign: "center",
		fontSize: 15,
	},
});
