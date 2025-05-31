import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthContext } from "../context/AuthContext.js";
import LoginScreen from "../screens/login/index.js";
import DashboardScreen from "../screens/dashboard/index.js";

const RootNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { isAuthenticated } = useAuthContext();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};
export default RootNavigator;
