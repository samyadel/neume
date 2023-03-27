import {
	View,
	Text,
	StyleSheet,
	Image,
	Pressable,
	useWindowDimensions,
	Dimensions,
	PixelRatio,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../../firebaseConfig";
import { ScrollView } from "react-native-gesture-handler";
import {
	scale,
	verticalScale,
	moderateScale,
	ScaledSheet,
} from "react-native-size-matters";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const widthBaseScale = SCREEN_WIDTH / 428;
const heightBaseScale = SCREEN_HEIGHT / 926;

function normalize(size, based = "width") {
	const newSize =
		based === "height" ? size * heightBaseScale : size * widthBaseScale;
	return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

//for width  pixel
const widthPixel = (size) => {
	return normalize(size, "width");
};
//for height  pixel
const heightPixel = (size) => {
	return normalize(size, "height");
};
//for font  pixel
const fontPixel = (size) => {
	return heightPixel(size);
};
//for Margin and Padding vertical pixel
const pixelSizeVertical = (size) => {
	return heightPixel(size);
};
//for Margin and Padding horizontal pixel
const pixelSizeHorizontal = (size) => {
	return widthPixel(size);
};

export default function GetStarted() {
	const navigation = useNavigation();

	// const { fontScale, scale, width, height } = useWindowDimensions();
	// const styles = makeStyles(fontScale, width);

	console.log(SCREEN_WIDTH, SCREEN_HEIGHT);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				navigation.reset({
					index: 0,
					routes: [{ name: "Homepage" }],
				});
			}
		});

		return unsubscribe;
	}, []);

	return (
		<ScrollView style={{ backgroundColor: "#ECEAF8" }}>
			<SafeAreaView style={styles.page}>
				<View style={styles.illustrationContainer}>
					<Image
						style={styles.illustration}
						source={require("../../../assets/illustration2.png")}
					/>
				</View>
				<Text style={styles.heading} numberOfLines={2} adjustsFontSizeToFit>
					Get the Grades You Deserve
				</Text>
				<Text style={styles.subheading} numberOfLines={2} adjustsFontSizeToFit>
					Let Neume handle the long, useless tasks. You focus on the important
					stuff
				</Text>

				<View style={styles.btnsWrapper}>
					<Pressable
						style={[styles.authOptionBtn, styles.loginBtn]}
						onPress={() => navigation.navigate("Login")}
					>
						<View style={styles.txtContainer}>
							<Text style={styles.btnTxt}>Log in</Text>
						</View>
					</Pressable>
					<Pressable
						style={[styles.authOptionBtn, styles.registerBtn]}
						onPress={() => navigation.navigate("Register")}
					>
						<Text style={styles.btnTxt}>Register</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		</ScrollView>
		// <SafeAreaView>
		// 	<ScrollView
		// 		style={{ backgroundColor: "#ECEAF8" }}
		// 		// contentContainerStyle={{ minHeight: "100%" }}
		// 		contentContainerStyle={styles.page}
		// 	>
		// 		<Image
		// 			style={styles.illustration}
		// 			source={require("../../../assets/illustration2.png")}
		// 		/>
		// 		{/* <View style={styles.illustrationContainer}>
		// 		</View> */}
		// 		<View style={styles.textWrapper}>
		// 			<Text style={styles.heading} numberOfLines={2} adjustsFontSizeToFit>
		// 				Get the Grades You Deserve
		// 			</Text>
		// 			<Text
		// 				style={styles.subheading}
		// 				numberOfLines={2}
		// 				adjustsFontSizeToFit
		// 			>
		// 				Let Neume handle the long, useless tasks. You focus on the important
		// 				stuff
		// 			</Text>
		// 		</View>

		// 		<View style={styles.btnsWrapper}>
		// 			<Pressable
		// 				style={[styles.authOptionBtn, styles.loginBtn]}
		// 				onPress={() => navigation.navigate("Login")}
		// 			>
		// 				<View style={styles.txtContainer}>
		// 					<Text style={styles.btnTxt}>Log in</Text>
		// 				</View>
		// 			</Pressable>
		// 			<Pressable
		// 				style={[styles.authOptionBtn, styles.registerBtn]}
		// 				onPress={() => navigation.navigate("Register")}
		// 			>
		// 				<Text style={styles.btnTxt}>Register</Text>
		// 			</Pressable>
		// 		</View>
		// 	</ScrollView>
		// </SafeAreaView>
		// <ScrollView
		// // style={{ backgroundColor: "#ECEAF8" }}
		// // style={}
		// // contentContainerStyle={styles.page}
		// >
		// 	<SafeAreaView style={styles.page}>
		// 		<View style={{ ...styles.illustrationContainer }}>
		// 			<Image
		// 				style={{ ...styles.illustration }}
		// 				source={require("../../../assets/illustration.png")}
		// 			/>
		// 		</View>
		// 		<Text
		// 			style={{
		// 				...styles.heading,
		// 				// fontSize: verticalScale(25),
		// 				// width: scale(),
		// 			}}
		// 			adjustsFontSizeToFit
		// 		>
		// 			Get the Grades You Deserve
		// 		</Text>
		// 		<Text
		// 			style={{
		// 				...styles.subheading,
		// 				// fontSize: moderateScale(16),
		// 				// lineHeight: verticalScale(20),
		// 			}}
		// 			adjustsFontSizeToFit
		// 		>
		// 			Let Neume handle the long, useless tasks. You focus on the important
		// 			stuff
		// 		</Text>

		// 		<View style={styles.btnsWrapper}>
		// 			<Pressable
		// 				style={[styles.authOptionBtn, styles.loginBtn]}
		// 				onPress={() => navigation.navigate("Login")}
		// 			>
		// 				<View style={styles.txtContainer}>
		// 					<Text
		// 						style={{
		// 							...styles.btnTxt,
		// 							// fontSize: moderateScale(17)
		// 						}}
		// 						adjustsFontSizeToFit
		// 					>
		// 						Log in
		// 					</Text>
		// 				</View>
		// 			</Pressable>
		// 			<Pressable
		// 				style={[styles.authOptionBtn, styles.registerBtn]}
		// 				onPress={() => navigation.navigate("Register")}
		// 			>
		// 				<Text
		// 					style={{
		// 						...styles.btnTxt,
		// 						// fontSize: moderateScale(17)
		// 					}}
		// 					adjustsFontSizeToFit
		// 				>
		// 					Register
		// 				</Text>
		// 			</Pressable>
		// 		</View>
		// 	</SafeAreaView>
		// </ScrollView>
	);
}

const styles = StyleSheet.create({
	page: {
		padding: 30,
		backgroundColor: "#ECEAF8",
		flex: 1,
	},
	illustrationContainer: {
		width: "100%",
		alignSelf: "center",
		// height: 370,
		borderRadius: 30,
		backgroundColor: "#FC6B68AA",
		borderWidth: 7,
		borderColor: "#FFF",
		// padding: 40,
		marginBottom: pixelSizeVertical(70),
	},
	illustration: {
		// // width: "100%",
		width: undefined,
		height: undefined,
		aspectRatio: 1,
		resizeMode: "contain",
	},
	heading: {
		fontWeight: "700",
		fontSize: 30,
		alignSelf: "center",
		width: "60%",
		textAlign: "center",
		marginBottom: pixelSizeVertical(30),
	},
	subheading: {
		textAlign: "center",
		width: "80%",
		alignSelf: "center",
		fontSize: 16,
		lineHeight: 25,
		opacity: 0.7,
		fontWeight: "500",
		marginBottom: pixelSizeVertical(90),
	},
	btnsWrapper: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "flex-start",
	},
	authOptionBtn: {
		borderWidth: 2,
		borderColor: "#FFF",
		padding: 20,
		borderRadius: 15,
		width: "50%",
	},
	registerBtn: {
		backgroundColor: "#FFF",
	},
	loginBtn: {
		width: "100%",
		position: "absolute",
		right: 0,
	},
	txtContainer: {
		width: "50%",
		alignSelf: "flex-end",
	},
	btnTxt: {
		textAlign: "center",
		fontWeight: "500",
		fontSize: 17,
	},
});

// const styles = StyleSheet.create({
// 	page: {
// 		padding: 30,
// 		backgroundColor: "#ECEAF8",
// 		flex: 1,
// 	},
// 	illustrationContainer: {
// 		// width: "100%",
// 		// height: heightPixel(370),
// 		borderRadius: 30,
// 		backgroundColor: "#FC6B68AA",
// 		borderWidth: 7,
// 		borderColor: "#FFF",
// 		// padding: 40,
// 		// paddingHorizontal: 40,
// 		// paddingVertical: 40,
// 		alignItems: "center",
// 		// marginBottom: pixelSizeVertical(70),
// 	},
// 	illustration: {
// 		// width: "100%",
// 		// height: undefined,
// 		// aspectRatio: 1,
// 		// resizeMode: "contain",
// 		width: widthPixel(250),
// 		height: heightPixel(250),
// 	},
// 	heading: {
// 		fontWeight: "700",
// 		fontSize: fontPixel(30),
// 		alignSelf: "center",
// 		width: "60%",
// 		textAlign: "center",
// 		marginBottom: 30,
// 	},
// 	subheading: {
// 		textAlign: "center",
// 		width: "80%",
// 		alignSelf: "center",
// 		fontSize: fontPixel(16),
// 		lineHeight: 25,
// 		opacity: 0.7,
// 		fontWeight: "500",
// 		marginBottom: 90,
// 	},
// 	btnsWrapper: {
// 		flexDirection: "row",
// 		width: "100%",
// 		justifyContent: "flex-start",
// 	},
// 	authOptionBtn: {
// 		borderWidth: 2,
// 		borderColor: "#FFF",
// 		padding: 20,
// 		borderRadius: 15,
// 		width: "50%",
// 	},
// 	registerBtn: {
// 		backgroundColor: "#FFF",
// 	},
// 	loginBtn: {
// 		width: "100%",
// 		position: "absolute",
// 		right: 0,
// 	},
// 	txtContainer: {
// 		width: "50%",
// 		alignSelf: "flex-end",
// 	},
// 	btnTxt: {
// 		textAlign: "center",
// 		fontWeight: "500",
// 		fontSize: 17,
// 	},
// });

// const makeStyles = (fontScale, width) =>
// 	ScaledSheet.create({
// 		page: {
// 			padding: 25,
// 			paddingVertical: 30,
// 			backgroundColor: "#ECEAF8",
// 			height: "100%",
// 			justifyContent: "space-between",
// 		},
// 		illustrationContainer: {
// 			// width: "100%",
// 			// height: "50%",
// 			borderRadius: 30,
// 			backgroundColor: "#FC6B68AA",
// 			borderWidth: 7,
// 			borderColor: "#FFF",
// 			padding: 40,
// 			// marginBottom: 70,
// 		},
// 		illustration: {
// 			// width: width,
// 			width: "90%",
// 			// padding: 150,
// 			alignSelf: "center",
// 			borderWidth: 7,
// 			borderColor: "#FFF",
// 			borderRadius: 30,
// 			backgroundColor: "#FC6B68AA",
// 			height: undefined,
// 			aspectRatio: 1,
// 			resizeMode: "contain",
// 		},
// 		// textWrapper: {
// 		// 	maxHeight: "50%",
// 		// 	// backgroundColor: "red",
// 		// },
// 		heading: {
// 			fontWeight: "700",
// 			fontSize: 40 / fontScale,
// 			alignSelf: "center",
// 			width: "60%",
// 			textAlign: "center",
// 			// marginVertical: 35,
// 			// marginBottom: 35,
// 			marginBottom: "5%",
// 		},
// 		subheading: {
// 			textAlign: "center",
// 			width: "80%",
// 			alignSelf: "center",
// 			fontSize: 16 / fontScale,
// 			lineHeight: 25,
// 			opacity: 0.7,
// 			fontWeight: "500",
// 			// marginBottom: 90,
// 		},
// 		btnsWrapper: {
// 			flexDirection: "row",
// 			width: "100%",
// 			justifyContent: "flex-start",
// 		},
// 		authOptionBtn: {
// 			borderWidth: 2,
// 			borderColor: "#FFF",
// 			padding: "5%",
// 			borderRadius: 15,
// 			width: "50%",
// 		},
// 		registerBtn: {
// 			backgroundColor: "#FFF",
// 		},
// 		loginBtn: {
// 			width: "100%",
// 			position: "absolute",
// 			right: 0,
// 		},
// 		txtContainer: {
// 			width: "50%",
// 			alignSelf: "flex-end",
// 		},
// 		btnTxt: {
// 			textAlign: "center",
// 			fontWeight: "500",
// 			fontSize: 17 / fontScale,
// 		},
// 	});

// const styles = StyleSheet.create({
// 	page: {
// 		padding: 30,
// 		backgroundColor: "#ECEAF8",
// 		flex: 1,
// 		justifyContent: "space-evenly",
// 	},
// 	illustrationContainer: {
// 		// width: "100%",
// 		// height: "50%",
// 		borderRadius: 30,
// 		backgroundColor: "#FC6B68AA",
// 		borderWidth: 7,
// 		borderColor: "#FFF",
// 		justifyContent: "center",
// 		alignItems: "center",
// 		padding: 40,
// 		// padding: 100,
// 		// marginBottom: 30,
// 	},
// 	illustration: {
// 		width: "100%",
// 		height: undefined,
// 		aspectRatio: 1,
// 		// backgroundColor: "red",
// 		// backgroundColor: "#FC6B68AA",
// 		// borderWidth: 7,
// 		// borderColor: "#FFF",
// 		// borderRadius: 30,
// 		// padding: 200,
// 		resizeMode: "contain",
// 	},
// 	heading: {
// 		fontWeight: "700",
// 		// fontSize: 30,
// 		alignSelf: "center",
// 		width: "100%",
// 		textAlign: "center",
// 		paddingHorizontal: 20,
// 		// marginVertical: 30,
// 	},
// 	subheading: {
// 		textAlign: "center",
// 		paddingHorizontal: 20,
// 		// width: "80%",
// 		alignSelf: "center",
// 		// fontSize: 16,
// 		// lineHeight: 25,
// 		opacity: 0.7,
// 		fontWeight: "500",
// 		// marginBottom: 90,
// 	},
// 	btnsWrapper: {
// 		flexDirection: "row",
// 		// width: "100%",
// 		justifyContent: "flex-start",
// 	},
// 	authOptionBtn: {
// 		borderWidth: 2,
// 		borderColor: "#FFF",
// 		padding: 20,
// 		borderRadius: 15,
// 		width: "50%",
// 	},
// 	registerBtn: {
// 		backgroundColor: "#FFF",
// 		borderBottomStartRadius: 0,
// 		borderTopStartRadius: 0,
// 	},
// 	loginBtn: {
// 		width: "50%",
// 		borderTopEndRadius: 0,
// 		borderBottomEndRadius: 0,
// 		// position: "absolute",
// 		// right: 0,
// 	},
// 	// txtContainer: {
// 	// 	width: "50%",
// 	// 	alignSelf: "flex-end",
// 	// },
// 	btnTxt: {
// 		textAlign: "center",
// 		fontWeight: "500",
// 		// fontSize: 17,
// 	},
// });
