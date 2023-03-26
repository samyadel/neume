import {
	StyleSheet,
	Text,
	View,
	Pressable,
	ActivityIndicator,
	Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Header from "../../Header";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import openAIRequest, { es } from "../../../../openAIRequest";

export default function DocView({ selectedDoc, saveDoc, loading }) {
	const navigation = useNavigation();
	const { name, content } = selectedDoc;

	const [referencedText, setReferencedText] = useState("");
	const [done, setDone] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [cancel, setCancel] = useState(false);

	const scrollviewRef = useRef();

	useEffect(() => {
		if (cancel) {
			es.close();
			navigation.goBack();
		}
	}, [cancel]);

	useEffect(() => {
		if (referencedText.length > 0) {
			console.log(referencedText);
		}
	}, [referencedText]);

	useEffect(() => {
		if (done) {
			navigation.navigate("Reference");
			saveDoc(referencedText);
			setReferencedText("");
		}
	}, [done]);

	useEffect(() => {
		if (error === "connection") {
			Alert.alert(
				"Connection error",
				"The connection was interrupted. Trying again"
			);
		} else if (error === "exception") {
			Alert.alert(
				"Unexpected error",
				"An error occured while trying to reference your work. Please try again"
			);
		}
	}, [error]);

	function addReference() {
		setIsLoading(true);
		openAIRequest(
			[
				{
					role: "user",
					content: `Rewrite the following essay with references, in AMA style. Use [cite number] format, and at the end of the essay, provide the links for each reference with the corresponding cite number. Here is the essay: ${content}`,
				},
			],
			setReferencedText,
			setDone,
			setIsLoading,
			setError
		);
	}

	return (
		<ScrollView
			style={styles.container}
			ref={scrollviewRef}
			onContentSizeChange={() =>
				scrollviewRef.current.scrollToEnd({ animated: true })
			}
		>
			<SafeAreaView style={styles.page}>
				<Header
					heading={name}
					icon1={
						<Pressable
							style={styles.returnBtn}
							onPress={() => {
								if (!isLoading) {
									navigation.goBack();
								} else {
									Alert.alert(
										"Cancel referencing?",
										`References are being added to your work. Do you want to cancel?`,
										[
											{
												text: "Cancel",
												style: "default",
												onPress() {
													console.log("cancelling");
													setCancel(true);
												},
											},
											{
												text: "Continue",
												style: "cancel",
											},
										],
										{ cancelable: true }
									);
								}
							}}
						>
							<Ionicons name="arrow-back" size={25} color="black" />
						</Pressable>
					}
				/>

				{isLoading ? (
					<View>
						<Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 20 }}>
							Adding references
						</Text>
						<Text style={styles.docContent}>{referencedText}</Text>
					</View>
				) : (
					<View>
						<Text numberOfLines={4} style={styles.docContent}>
							{content}
						</Text>

						<View style={styles.allTools}>
							<View style={styles.toolWrapper}>
								<Text style={styles.toolTitle}>Add references to your doc</Text>

								<View style={styles.buttonsContainer}>
									<Pressable
										style={styles.button}
										onPress={() => navigation.navigate("Reference")}
									>
										<Text style={styles.goBtnText}>View</Text>
									</Pressable>

									<Pressable
										style={{
											...styles.goBtn,
											...styles.button,
											backgroundColor: loading
												? "rgba(0, 0, 0, .06)"
												: "#F96968",
										}}
										onPress={addReference}
									>
										{!loading ? (
											<Text style={styles.goBtnText}>Go</Text>
										) : (
											<ActivityIndicator size={20} color={"black"} />
										)}
									</Pressable>
								</View>
							</View>

							<View style={styles.toolWrapper}>
								<Text style={styles.toolTitle}>Chat to your document</Text>

								<View style={styles.buttonsContainer}>
									<Pressable
										style={{
											...styles.goBtn,
											...styles.button,
											backgroundColor: loading
												? "rgba(0, 0, 0, .06)"
												: "#F96968",
										}}
										onPress={() => navigation.navigate("Chat")}
									>
										<Text style={styles.goBtnText}>Start chatting</Text>
									</Pressable>
								</View>
							</View>

							{/* <View style={styles.toolWrapper}>
						<Text style={styles.toolTitle}>Paraphrase your doc</Text>

						<View style={styles.buttonsContainer}>
							<Pressable style={styles.button}>
								<Feather name="eye" size={20} color="white" />
							</Pressable>
							<Pressable style={{ ...styles.goBtn, ...styles.button }}>
								<Text style={styles.goBtnText}>Go</Text>
							</Pressable>
						</View>
					</View>

					<View style={styles.toolWrapper}>
						<Text style={styles.toolTitle}>Improve your work</Text>

						<View style={styles.buttonsContainer}>
							<Pressable style={styles.button}>
								<Feather name="eye" size={20} color="white" />
							</Pressable>
							<Pressable style={{ ...styles.goBtn, ...styles.button }}>
								<Text style={styles.goBtnText}>Go</Text>
							</Pressable>
						</View>
					</View> */}
						</View>
					</View>
				)}
			</SafeAreaView>

			<View
				style={{
					position: "absolute",
					flex: 1,
					height: "500%",
					width: "100%",
					display: loading ? "flex" : "none",
				}}
			></View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	page: {
		paddingHorizontal: 30,
		width: "100%",
		height: "100%",
		marginTop: 47,
	},
	docContent: {
		backgroundColor: "rgba(0, 0, 0, .04)",
		fontSize: 16,
		borderRadius: 10,
		marginBottom: 25,
		padding: 20,
		width: "100%",
		paddingTop: 20,
	},
	allTools: {
		width: "100%",
	},
	toolWrapper: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, .02)",
		marginBottom: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "rgba(0, 0, 0, 0.5)",
	},
	toolTitle: {
		padding: 15,
	},
	buttonsContainer: {
		flexDirection: "row",
		width: "40%",
		justifyContent: "flex-end",
	},
	button: {
		backgroundColor: "#F96968",
		padding: 20,
		justifyContent: "center",
	},
	goBtn: {
		borderTopEndRadius: 8,
		borderBottomEndRadius: 8,
		borderLeftWidth: 2,
		borderLeftColor: "rgba(0, 0, 0, .2)",
	},
	goBtnText: {
		color: "#FFF",
		fontWeight: "500",
	},
});
