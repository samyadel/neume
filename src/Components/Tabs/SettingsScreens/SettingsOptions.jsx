import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
	AntDesign,
	MaterialIcons,
	Feather,
	Ionicons,
} from "@expo/vector-icons";
import Header from "../../Header";

export default function SettingsOptions({ handleLogOut }) {
	const navigation = useNavigation();

	return (
		<SafeAreaView style={styles.page}>
			<Header heading="Settings" />

			<View style={styles.optionsContainer}>
				<Pressable
					style={styles.button}
					onPress={() => navigation.navigate("AccountInformation")}
				>
					<View style={styles.leftContainer}>
						<Feather name="user" size={18} color="black" />
						<Text style={styles.buttonTxt}>Account information</Text>
					</View>
					<AntDesign name="right" size={16} color="black" />
				</Pressable>
				<Pressable style={styles.button}>
					<View style={styles.leftContainer}>
						<MaterialIcons name="support-agent" size={18} color="black" />
						<Text style={styles.buttonTxt}>Support</Text>
					</View>
					<AntDesign name="right" size={16} color="black" />
				</Pressable>
				<Pressable style={styles.button}>
					<View style={styles.leftContainer}>
						<Ionicons
							name="ios-document-text-outline"
							size={18}
							color="black"
						/>
						<Text style={styles.buttonTxt}>Terms of service</Text>
					</View>
					<AntDesign name="right" size={16} color="black" />
				</Pressable>
				<Pressable style={styles.button} onPress={handleLogOut}>
					<View style={styles.leftContainer}>
						<MaterialIcons name="logout" size={18} color="black" />
						<Text style={styles.buttonTxt}>Log out</Text>
					</View>
					<AntDesign name="right" size={16} color="black" />
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	page: {
		alignItems: "center",
		marginTop: 40,
		width: "100%",
		height: "93.5%",
	},
	optionsContainer: {
		width: "100%",
		backgroundColor: "#ECEAF8",
		height: "100%",
		padding: 20,
		paddingTop: 30,
	},
	button: {
		flexDirection: "row",
		backgroundColor: "#FFF",
		padding: 20,
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, .2)",
	},
	buttonTxt: {
		fontSize: 16,
		fontWeight: "500",
		marginLeft: 10,
	},
	leftContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
});
