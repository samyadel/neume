import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Pressable, Alert, Image } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";

import firebase from "../../../../firebaseConfig";
import {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";

import * as ImagePicker from "expo-image-picker";

import LoadingCard from "../../LoadingCard";

export default function TextScanner({ setCreatedNoteContent }) {
	const [loading, setLoading] = useState(false);
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [image, setImage] = useState();
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
	const cameraRef = useRef(null);
	const navigation = useNavigation();

	const submitToGoogle = async (url) => {
		try {
			let response = await axios.post(
				"https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAEN-sefrRgsg_4aWc7ZijvVWgvqz55d9U&fields=responses.fullTextAnnotation.text",
				{
					requests: [
						{
							features: [
								{ type: "TEXT_DETECTION", maxResults: 50 },
								{
									maxResults: 50,
									model: "builtin/latest",
									type: "DOCUMENT_TEXT_DETECTION",
								},
							],
							image: {
								source: {
									imageUri: url,
								},
							},
						},
					],
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const detectedText = response.data.responses[0].fullTextAnnotation.text;

			console.log(detectedText);

			return detectedText;
		} catch (error) {
			console.log(error);
		}
	};

	const handlePress = async () => {
		if (cameraRef) {
			setLoading(true);

			try {
				const data = await cameraRef.current.takePictureAsync();

				setImage(data);
			} catch (e) {
				console.log(e);
			}
		}
	};

	const uploadImage = async () => {
		const response = await fetch(image);
		const blob = await response.blob();
		// const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
		const filename = image.substring(image.lastIndexOf("/") + 1);
		let ref = firebase.storage().ref().child(filename).put(blob);

		try {
			await ref;
			// Alert.alert("Photo uploaded");
		} catch (e) {
			console.log(e);
		}
	};

	const takePictureAsync = async () => {
		const { canceled, uri, base64 } = await ImagePicker.launchCameraAsync({
			base64: true,
		});

		if (!canceled) {
			setImage(uri);
			setLoading(true);
		} else {
			setImage(null);
			setLoading(false);

			navigation.navigate("Create");
		}
	};

	useEffect(() => {
		(async () => {
			MediaLibrary.requestPermissionsAsync();
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission(cameraStatus.status === "granted");
		})();
	}, []);

	useEffect(() => {
		if (hasCameraPermission) {
			takePictureAsync();
		}
	}, [hasCameraPermission]);

	useEffect(() => {
		(async () => {
			if (image) {
				try {
					await uploadImage();

					const filepath = `/${image.substring(image.lastIndexOf("/") + 1)}`;
					// const filepath = `/${image.uri.substring(
					// 	image.uri.lastIndexOf("/") + 1
					// )}`;

					const storage = getStorage();
					const reference = ref(storage, filepath);

					await getDownloadURL(reference)
						.then(async (url) => {
							setCreatedNoteContent(await submitToGoogle(url));
							navigation.goBack();
						})
						.catch((e) => console.log(e));

					await deleteObject(reference);
				} catch (error) {
					console.error(error);
				}
			}

			setLoading(false);
		})();
	}, [image]);

	return (
		<View style={styles.container}>
			{!image ? (
				<Camera
					style={styles.camera}
					type={Camera.Constants.Type.Back}
					flashMode={flash}
					ref={cameraRef}
				/>
			) : (
				// <Image source={{ uri: image.uri }} style={styles.camera} />
				<Image source={{ uri: image }} style={styles.camera} />
			)}
			{/* <View style={styles.card}>
				<View>
					<Text style={styles.heading}>Scan some text</Text>
					<Text style={styles.subheading}>
						Automatically save text to your profile by scanning it with your
						camera
					</Text>
				</View>
				<Pressable style={styles.scanBtn} onPress={takePictureAsync}>
					<Text style={styles.scanBtnTxt}>Scan</Text>
				</Pressable>
			</View> */}

			<LoadingCard
				loadingText={"Scanning text"}
				isLoading={loading}
				width="55%"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "gray",
	},
	camera: {
		flex: 1,
	},
	card: {
		backgroundColor: "#fff",
		padding: 40,
		position: "absolute",
		bottom: 0,
		borderRadius: 15,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		height: "35%",
		width: "100%",
		justifyContent: "space-between",
		opacity: 0.8,
	},
	heading: {
		fontWeight: "700",
		fontSize: 20,
		marginBottom: 15,
	},
	subheading: {
		fontSize: 16,
		opacity: 0.4,
		lineHeight: 22,
	},
	scanBtn: {
		backgroundColor: "#000",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
	},
	scanBtnTxt: {
		color: "#FFF",
		fontWeight: "700",
	},
});
