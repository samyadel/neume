import Homepage from "./Tabs/Homepage";
import Settings from "./Tabs/Settings";
import Documents from "./Tabs/Documents";
import AskYourNote from "./Tabs/AskYourNote";
import ImproveWork from "./Tabs/ImproveWork";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { auth } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from "react";

const Tab = createBottomTabNavigator();

export default function App() {
	const [tokens, setTokens] = useState(0);
	const navigation = useNavigation();

	function handleLogOut() {
		auth
			.signOut()
			.then(() => {
				navigation.reset({
					index: 0,
					routes: [{ name: "GetStarted" }],
				});
			})
			.catch((e) => {
				console.log(e.message);
			});
	}

	const tabBarStyle = {
		backgroundColor: "#000",
		justifyContent: "center",
		alignItems: "center",
		height: 110,
		padding: 0,
		paddingHorizontal: 25,
	};

	return (
		<Tab.Navigator
			sceneContainerStyle={{ backgroundColor: "#fff" }}
			screenOptions={({ route }) => ({
				tabBarStyle,
				headerShown: false,
				tabBarShowLabel: false,
				tabBarIcon: ({ color }) => {
					const size = 28;

					if (route.name === "Home") {
						return <Feather name={"home"} size={size} color={color} />;
					} else if (route.name === "Settings") {
						return (
							<Ionicons name={"settings-outline"} size={size} color={color} />
						);
					} else if (route.name === "ImproveWork") {
						return (
							<MaterialIcons name="question-answer" size={size} color={color} />
						);
					} else if (route.name === "Documents") {
						return <Ionicons name="document-text" size={size} color={color} />;
					}
				},
				tabBarActiveTintColor: "white",
				tabBarInactiveTintColor: "#6C6C6C",
			})}
		>
			<Tab.Screen name="Home">
				{() => {
					return (
						<Homepage
							handleLogOut={handleLogOut}
							tokens={tokens}
							setTokens={setTokens}
						/>
					);
				}}
			</Tab.Screen>
			{/* <Tab.Screen name="AskYourNote" component={AskYourNote} /> */}
			{/* <Tab.Screen name="ImproveWork" component={ImproveWork} /> */}
			<Tab.Screen name="Documents">
				{() => {
					return <Documents tokens={tokens} setTokens={setTokens} />;
				}}
			</Tab.Screen>
			<Tab.Screen name="Settings">
				{() => {
					return <Settings handleLogOut={handleLogOut} />;
				}}
			</Tab.Screen>
		</Tab.Navigator>
	);
}
