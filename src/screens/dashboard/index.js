import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthContext } from "../../context/AuthContext.js";
import { Button } from "react-native";

export default function DashboardScreen() {
  const { logout } = useAuthContext();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
