import { createStackNavigator } from "@react-navigation/stack";
import SettingsOptions from "./SettingsScreens/SettingsOptions";
import AccountInformation from "./SettingsScreens/AccountInformation";

const Stack = createStackNavigator();

export default function Settings({ handleLogOut }) {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				cardStyle: {
					backgroundColor: "#FFF",
				},
			}}
		>
			<Stack.Screen name="SettingsOptions">
				{() => {
					return <SettingsOptions handleLogOut={handleLogOut} />;
				}}
			</Stack.Screen>
			<Stack.Screen name="AccountInformation" component={AccountInformation} />
		</Stack.Navigator>
	);
}
