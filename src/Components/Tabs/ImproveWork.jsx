import {
	View,
	Text,
	StyleSheet,
	Keyboard,
	Pressable,
	Alert,
	ScrollView,
	TextInput,
} from "react-native";
// import { ScrollView, TextInput } from "react-native-gesture-handler";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingCard from "../LoadingCard";
import axios from "axios";
import TipCard from "./ImproveWorkComponents/TipCard";
import Header from "../Header";

export default function ImproveWork() {
	const [isLoading, setIsLoading] = useState(false);
	const [previousWork, setPreviousWork] = useState("");
	const [work, setWork] = useState("");
	const [tips, setTips] = useState([]);
	const [selectedTips, setSelectedTips] = useState([]);
	const [enhancedWork, setEnhancedWork] = useState("");

	async function generateTips(userWork) {
		setIsLoading(true);
		Keyboard.dismiss();

		const apiKey = "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";
		const apiUrl = "https://api.openai.com/v1/completions";

		const prompt = `Can you give 5 tips to improve the following answer. With each tip, give an example. Be straight to the point and do not be too wordy. Return your answer in a JSON object with each tip grouped in an object with its corresponding example. Here is how I want it to be formated {"tips": [{"tip": "", "example": ""}]}: ${userWork}`;
		const res = await axios
			.post(
				apiUrl,
				{
					model: "text-davinci-003",
					prompt,
					max_tokens: 1024,
					temperature: 0.5,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
				}
			)
			.catch((e) => {
				Alert.alert("Oh oh!", "Something went wrong. Please try again.", [
					{ text: "OK" },
				]);

				setIsLoading(false);
				console.log(e);
			});

		const generatedTips = res.data.choices[0].text;

		const tipsArr = JSON.parse(`${generatedTips}`).tips;

		setTips(tipsArr);
		setPreviousWork(work);
		setSelectedTips([]);
		setEnhancedWork("");

		setIsLoading(false);
	}

	async function enhanceWork() {
		setIsLoading(true);
		Keyboard.dismiss();

		const apiKey = "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";
		const apiUrl = "https://api.openai.com/v1/completions";

		const prompt = `I will first paste a piece of text, and then paste an array of tips. Please rewrite the piece of text with each of the tips applied to it. PIECE OF TEXT: ${work}. ARRAY OF TIPS: ${selectedTips}`;
		const res = await axios
			.post(
				apiUrl,
				{
					model: "text-davinci-003",
					prompt,
					max_tokens: 1024,
					temperature: 0.5,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
				}
			)
			.catch((e) => {
				Alert.alert("Oh oh!", "Something went wrong. Please try again.", [
					{ text: "OK" },
				]);

				setIsLoading(false);
				console.log(e);
			});

		const improvedWork = res.data.choices[0].text.trim();

		setEnhancedWork(improvedWork);

		setIsLoading(false);
	}

	return (
		<View style={{ height: "100%" }}>
			<ScrollView
				style={{ width: "100%" }}
				automaticallyAdjustKeyboardInsets={true}
			>
				{/* <Pressable onPress={Keyboard.dismiss}> */}
				<SafeAreaView style={styles.page}>
					{/* <View style={styles.pageHeading}>
						<Text style={[styles.header, styles.header2]}>
							Improve your work
						</Text>
					</View> */}
					<Header heading="Improve your work" />

					<View style={styles.wrapper}>
						<View style={{ marginHorizontal: 30 }}>
							<TextInput
								onChangeText={(newWork) => setWork(newWork)}
								style={[styles.input, styles.workInput]}
								placeholder="Paste in your work"
								multiline={true}
							/>

							<Pressable
								style={[styles.input, styles.button]}
								onPress={() => generateTips(work)}
							>
								<Text style={styles.btnText}>
									{previousWork === work && work
										? "Regenerate tips"
										: "How can I improve my work?"}
								</Text>
							</Pressable>
						</View>

						<ScrollView style={styles.tipsWrapper} horizontal={true}>
							{tips.map((tip, i) => (
								<TipCard
									key={i}
									id={i}
									tip={tip}
									selectedTips={selectedTips}
									setSelectedTips={setSelectedTips}
								/>
							))}
						</ScrollView>

						<View style={{ marginHorizontal: 30 }}>
							{tips.length > 0 && (
								<View>
									<View style={styles.improveWorkWrapper}>
										<Text>
											{selectedTips.length}/{tips.length} Tips selected
										</Text>

										<Pressable onPress={enhanceWork}>
											<Text style={styles.applyBtn}>Apply tips to my work</Text>
										</Pressable>
									</View>

									<Text style={styles.input}>
										{enhancedWork ||
											"Select the tips you want to apply, and press 'Apply tips to my work' to generate a well-written answer"}
									</Text>

									{/* <TextInput
									style={styles.input}
									placeholder="Select the tips you want applied, and click 'Apply tips to my work'"
									multiline={true}
									value={enhancedWork}
								/> */}
								</View>
							)}
						</View>
					</View>
				</SafeAreaView>
				{/* </Pressable> */}
			</ScrollView>
			<LoadingCard
				loadingText={"Improving your work"}
				isLoading={isLoading}
				width="66%"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		alignItems: "center",
		marginTop: 40,
		// paddingHorizontal: 30,
		width: "100%",
		height: "93.5%",
	},
	wrapper: {
		width: "100%",
	},
	input: {
		backgroundColor: "rgba(0, 0, 0, .04)",
		padding: 20,
		paddingTop: 20,
		fontSize: 16,
		fontWeight: "500",
		borderRadius: 10,
		marginBottom: 15,
		width: "100%",
	},
	workInput: {
		// height: 140,
		height: 250,
	},
	button: {
		backgroundColor: "#FC6B68",
		paddingVertical: 15,
		marginBottom: 35,
	},
	btnText: {
		color: "#FFF",
		fontWeight: "800",
		textAlign: "center",
	},
	tipsWrapper: {
		paddingHorizontal: 10,
		width: "100%",
	},
	improveWorkWrapper: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	applyBtn: {
		fontWeight: "700",
		color: "#FC6B68",
		borderWidth: 2,
		padding: 5,
		borderRadius: 5,
		borderColor: "#FC6B68",
	},
});
