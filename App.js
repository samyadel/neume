import "react-native-gesture-handler";
import "expo-dev-client";
import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import GetStarted from "./src/Components/AuthScreens/GetStarted";
import Register from "./src/Components/AuthScreens/Register";
import Login from "./src/Components/AuthScreens/Login";
import AppView from "./src/Components/AppView";
import Paywall from "./src/Components/Paywall";
import ForgotPassword from "./src/Components/AuthScreens/ForgotPassword";

// web = 982426357820-kbmhtkccg8ddva3vgifqoipuph1c5323.apps.googleusercontent.com
// ios = 982426357820-ethm62eg90d7irguutgoav9ftojuqlt3.apps.googleusercontent.com

export default function App() {
	const Stack = createStackNavigator();

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					cardStyle: {
						backgroundColor: "#FFF",
					},
				}}
			>
				<Stack.Screen name="GetStarted" component={GetStarted} />
				<Stack.Screen name="Register" component={Register} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
				<Stack.Screen name="Homepage" component={AppView} />
				<Stack.Screen
					name="Paywall"
					component={Paywall}
					options={{ presentation: "modal" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
