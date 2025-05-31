import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import LoginScreen from "./src/screens/login/index.js";
import { AuthContextProvider } from "./src/context/AuthContext.js";
import LoginScreen from "./src/screens/login/index.js";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/app.navigation.js";

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <AuthContextProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthContextProvider>
    // <LoginScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
