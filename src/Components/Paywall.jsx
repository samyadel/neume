import {
	View,
	Text,
	StyleSheet,
	Pressable,
	ActivityIndicator,
	Alert,
	Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import useRevenueCat from "../../hooks/useRevenueCat";
import Purchases from "react-native-purchases";

export default function Paywall() {
	const navigation = useNavigation();
	const { currentOffering } = useRevenueCat();

	const [isMonthlyLoading, setIsMonthlyLoading] = useState(false);
	const [isYearlyLoading, setIsYearlyLoading] = useState(false);
	const [isRestoreLoading, setIsRestoreLoading] = useState(false);
	const [isEligibleForTrial, setIsEligibleForTrial] = useState(true);
	const [activeSubscription, setActiveSubscription] = useState("");

	useEffect(() => {
		Purchases.checkTrialOrIntroductoryPriceEligibility(["pro"]).then((res) =>
			res.pro.status === 1
				? setIsEligibleForTrial(false)
				: setIsEligibleForTrial(true)
		);

		Purchases.getCustomerInfo().then((res) => {
			if (res.activeSubscriptions.length > 0) {
				if (res.activeSubscriptions[0] === "proYearly") {
					Alert.alert(
						"Subscribed to Neume Pro Yearly",
						"Manage your subscriptions in device settings, or switch to Neume Pro Monthly"
					);
				} else if (res.activeSubscriptions[0] === "pro") {
					Alert.alert(
						"Subscribed to Neume Pro Monthly",
						"Manage your subscriptions in device settings, or switch to Neume Pro Yearly"
					);
				}
			}
			setActiveSubscription(res.activeSubscriptions);
		});
	}, []);

	const handleMonthlyPurchase = async () => {
		if (!currentOffering?.monthly) return;

		setIsMonthlyLoading(true);

		const purchaserInfo = await Purchases.purchasePackage(
			currentOffering.monthly
		).catch((e) => {
			setIsMonthlyLoading(false);
		});

		setIsMonthlyLoading(false);

		console.log(
			"MONTHLY SUBSCRIPTION PURCHASED " +
				purchaserInfo.customerInfo.entitlements.active
		);

		if (purchaserInfo.customerInfo.entitlements.active.pro) {
			navigation.goBack();
		}
	};

	const handleYearlyPurchase = async () => {
		if (!currentOffering?.annual) return;

		setIsYearlyLoading(true);

		const purchaserInfo = await Purchases.purchasePackage(
			currentOffering.annual
		).catch((e) => {
			setIsYearlyLoading(false);
		});

		setIsYearlyLoading(false);

		console.log(
			"YEARLY SUBSCRIPTION PURCHASED " +
				purchaserInfo.customerInfo.entitlements.active
		);

		if (purchaserInfo.customerInfo.entitlements.active.pro) {
			navigation.goBack();
		}
	};

	const restorePurchases = async () => {
		setIsRestoreLoading(true);

		const purchaserInfo = await Purchases.restorePurchases().catch((e) => {
			setIsRestoreLoading(false);

			Alert.alert(
				"Error",
				"There was an error trying to restore your purchase. Please try again"
			);
		});

		setIsRestoreLoading(false);

		if (purchaserInfo.activeSubscriptions.length > 0) {
			Alert.alert("Success", "Your purchase has been restored");
		} else {
			Alert.alert("Fail", "No purchase to restore");
		}

		navigation.goBack();
	};

	if (!currentOffering) {
		return (
			<View style={{ height: "100%", justifyContent: "center" }}>
				<ActivityIndicator size={24} color={"#0069FE"} />
			</View>
		);
	}

	return (
		<ScrollView contentContainerStyle={styles.paywall}>
			<Image
				style={styles.proFeature}
				source={require("../../assets/proFeature1.png")}
			/>

			<View style={styles.header}>
				<Text style={styles.heading}>Get Neume Pro</Text>
				<Text style={styles.subheading}>
					Get unlimited Neume tokens so that you can generate as many notes,
					flashcards and smart documents as you want
				</Text>
			</View>

			<Text
				style={styles.startingPrice}
				onPress={
					!isMonthlyLoading && !isYearlyLoading && !isRestoreLoading
						? navigation.goBack
						: undefined
				}
			>
				Continue with limited access
			</Text>

			<Pressable
				style={styles.choosePlanBtn}
				onPress={
					!isMonthlyLoading && !isYearlyLoading && !isRestoreLoading
						? handleMonthlyPurchase
						: undefined
				}
			>
				{isMonthlyLoading ? (
					<ActivityIndicator size={24} color={"#FFF"} />
				) : (
					<Text style={styles.choosePlanText}>
						{isEligibleForTrial
							? "Start your 1 week free trial"
							: `Subscribe for ${currentOffering.monthly?.product.priceString} / month`}
					</Text>
				)}
			</Pressable>
			<Pressable
				style={styles.restorePurchasesBtn}
				onPress={
					!isMonthlyLoading && !isYearlyLoading && !isRestoreLoading
						? handleYearlyPurchase
						: undefined
				}
			>
				{isYearlyLoading ? (
					<ActivityIndicator size={24} color={"#0069FE"} />
				) : (
					<Text style={styles.restorePurchasesText}>
						Save{" "}
						{(
							(1 -
								currentOffering.annual?.product.price /
									(currentOffering.monthly?.product.price * 12)) *
							100
						).toPrecision(2)}
						% Anually {currentOffering.annual?.product.priceString} / year
					</Text>
				)}
			</Pressable>
			<Pressable
				style={styles.continueWithFreeBtn}
				onPress={
					!isMonthlyLoading && !isYearlyLoading && !isRestoreLoading
						? restorePurchases
						: undefined
				}
			>
				{isRestoreLoading ? (
					<ActivityIndicator size={24} color={"#0069FE"} />
				) : (
					<Text style={styles.continueWithFreeText}>Restore purchases</Text>
				)}
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	paywall: {
		paddingVertical: 30,
		paddingHorizontal: 20,
		// height: "100%",
	},
	proFeature: {
		width: "100%",
		height: undefined,
		resizeMode: "contain",
		aspectRatio: 1.24,
		borderRadius: 20,
	},
	header: {
		marginBottom: 65,
	},
	heading: {
		fontWeight: "700",
		fontSize: 28,
		textAlign: "center",
		marginTop: 35,
		marginBottom: 25,
	},
	subheading: {
		textAlign: "center",
		fontSize: 20,
		opacity: 0.4,
		lineHeight: 29,
	},
	startingPrice: {
		textAlign: "center",
		padding: 20,
		fontSize: 14,
		opacity: 0.4,
		fontWeight: "500",
	},
	choosePlanBtn: {
		backgroundColor: "#0069FE",
		padding: 20,
		borderRadius: 100,
		marginVertical: 10,
	},
	choosePlanText: {
		textAlign: "center",
		color: "#fff",
		fontSize: 18,
	},
	restorePurchasesBtn: {
		padding: 20,
	},
	restorePurchasesText: {
		textAlign: "center",
		color: "#0069FE",
		fontSize: 18,
	},
	continueWithFreeBtn: {
		padding: 15,
	},
	continueWithFreeText: {
		opacity: 0.4,
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
		borderRadius: 100,
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
