import { View, Text, Dimensions, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { FontAwesome5, AntDesign, MaterialIcons } from "@expo/vector-icons";

const NOTE_HEIGHT = 217;

export default function Note({
	onPress,
	onLongPress,
	note,
	onDismiss,
	simultaneousHandlers,
	favouriteNote,
	id,
	favourite,
	onQuestionShow,
}) {
	// const [isFavourited, setIsFavourited] = useState(favourite);
	const { width: SCREEN_WIDTH } = Dimensions.get("window");
	const RIGHT_TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.155;
	const LEFT_TRANSLATE_X_THRESHOLD = SCREEN_WIDTH * 0.155;
	const translateX = useSharedValue(0);
	const itemHeight = useSharedValue(200);
	const marginBottom = useSharedValue(30);
	const opacity = useSharedValue(1);

	const panGesture = useAnimatedGestureHandler({
		onActive: (e) => {
			if (e.translationX < 0) {
				translateX.value = e.translationX;
			}
		},
		onEnd: (e) => {
			const shouldBeDismissed = translateX.value < RIGHT_TRANSLATE_X_THRESHOLD;

			if (shouldBeDismissed) {
				translateX.value = withTiming(-SCREEN_WIDTH);
				itemHeight.value = withTiming(0);
				marginBottom.value = withTiming(0);
				opacity.value = withTiming(0, undefined, (isFinished) => {
					if (isFinished && onDismiss) {
						runOnJS(onDismiss)(note);
					}
				});
			} else {
				if (translateX.value > LEFT_TRANSLATE_X_THRESHOLD) {
					console.log("hi");
					runOnJS(onQuestionShow)(note);
				}

				translateX.value = withTiming(0);
			}
		},
	});

	const rStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: translateX.value,
			},
		],
	}));

	const rTrashIconContainerStyle = useAnimatedStyle(() => {
		const opacity = withTiming(
			translateX.value < RIGHT_TRANSLATE_X_THRESHOLD ? 1 : 0
		);
		return { opacity };
	});

	const rQuestionIconContainerStyle = useAnimatedStyle(() => {
		const opacity = withTiming(
			translateX.value > LEFT_TRANSLATE_X_THRESHOLD ? 1 : 0
		);
		return { opacity };
	});

	const rNoteContainerStyle = useAnimatedStyle(() => {
		return {
			height: itemHeight.value,
			marginBottom: marginBottom.value,
			opacity: opacity.value,
		};
	});

	function handleLongPress() {
		console.log("longpress");
	}

	return (
		<Pressable onPress={onPress} onLongPress={onLongPress}>
			<Animated.View
				style={[styles.noteContainer, rNoteContainerStyle]}
				// onLayout={getHeight}
			>
				<Animated.View style={[styles.trashBtn, rTrashIconContainerStyle]}>
					<FontAwesome5 name="trash-alt" size={27} color="#FC6B68" />
				</Animated.View>
				<Animated.View
					style={[styles.questionBtn, rQuestionIconContainerStyle]}
				>
					<MaterialIcons name="question-answer" size={27} color="#FC6B68" />
				</Animated.View>
				<PanGestureHandler
					// activeOffsetX={-20}
					simultaneousHandlers={simultaneousHandlers}
					onGestureEvent={panGesture}
				>
					<Animated.View
						style={{
							...rStyle,
						}}
					>
						<View
							style={{
								...styles.note,
								backgroundColor: note.bgColor,
							}}
						>
							<View style={styles.noteHeading}>
								<Text numberOfLines={1} style={styles.title}>
									{note.title}
								</Text>
								<Pressable
									onPress={() => {
										favouriteNote(id);
										// setIsFavourited(!isFavourited);
									}}
								>
									<AntDesign
										name={`${favourite ? "star" : "staro"}`}
										size={20}
										color="grey"
									/>
								</Pressable>
							</View>
							<Text style={styles.previewText} numberOfLines={4}>
								{note.content}
							</Text>

							<View style={styles.footer}>
								{/* <View style={styles.tags}>
									{note.tags.map((tag, i) => (
										<Text key={i} style={styles.tag}>
											{tag}
										</Text>
									))}
								</View> */}

								<Text>{note.date}</Text>
							</View>
						</View>
					</Animated.View>
				</PanGestureHandler>
			</Animated.View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	note: {
		backgroundColor: "#F2F8FF",
		borderRadius: 15,
		padding: 20,
		width: "100%",
		height: NOTE_HEIGHT,
		borderWidth: 5,
		borderColor: "#ECEAF8",
	},
	questionBtn: {
		position: "absolute",
		left: "6%",
		height: "100%",
		width: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	trashBtn: {
		position: "absolute",
		right: "6%",
		height: "100%",
		width: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	noteHeading: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	title: {
		fontWeight: "700",
		fontSize: 20,
		letterSpacing: 1.5,
		lineHeight: 30,
		marginBottom: 20,
		width: "85%",
	},
	previewText: {
		fontSize: 14,
		color: "gray",
		lineHeight: 22,
		marginBottom: 18,
		height: "51%",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		opacity: 0.4,
	},
	tags: {
		flexDirection: "row",
	},
	tag: {
		marginRight: 10,
	},
});
