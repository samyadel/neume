import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Paywall() {
	const navigation = useNavigation();

	return (
		<ScrollView contentContainerStyle={styles.paywall}>
			<View style={styles.header}>
				<Text style={styles.heading}>Upgrade</Text>
				<Text style={styles.subheading}>
					Upgrade to Pro to access all the features
				</Text>
			</View>

			<Pressable onPress={navigation.goBack} style={styles.closeBtn}>
				<AntDesign name="closecircle" size={32} color="#FC6B68" />
			</Pressable>

			<View style={styles.buttons}>
				<Pressable style={[styles.purchaseBtn, styles.filledBtn]}>
					<Text style={styles.mainText}>Start a 1 week free trial</Text>
					<Text style={styles.secondaryText}>GBP 8.99/month after</Text>
				</Pressable>

				<Pressable style={styles.purchaseBtn}>
					<Text style={[styles.mainText, styles.darkText]}>
						Save 45% anually
					</Text>
					<Text style={[styles.secondaryText, styles.darkText]}>
						GBP 59.99/year
					</Text>
				</Pressable>

				<Pressable>
					<Text style={styles.restorePurchases}>Restore Purchases</Text>
				</Pressable>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	paywall: {
		paddingVertical: 50,
		paddingHorizontal: 20,
		height: "100%",
		justifyContent: "space-between",
	},
	header: {
		marginBottom: 50,
	},
	heading: {
		fontWeight: "700",
		fontSize: 24,
		textTransform: "uppercase",
		textAlign: "center",
		marginBottom: 10,
	},
	subheading: {
		textAlign: "center",
		fontSize: 15,
	},
	closeBtn: {
		position: "absolute",
		right: 30,
		top: 30,
	},
	purchaseBtn: {
		borderWidth: 3,
		borderRadius: "50%",
		padding: 23,
		marginBottom: 20,
		borderColor: "#FC6B68",
		justifyContent: "space-between",
		height: 95,
		width: "100%",
	},
	filledBtn: {
		backgroundColor: "#FC6B68",
	},
	mainText: {
		color: "#FFF",
		fontWeight: "700",
		textTransform: "uppercase",
		textAlign: "center",
		fontSize: 15,
	},
	secondaryText: {
		textAlign: "center",
		color: "#FFF",
	},
	darkText: {
		color: "#000",
	},
	restorePurchases: {
		textAlign: "center",
	},
});
