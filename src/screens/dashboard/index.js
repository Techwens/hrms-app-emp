import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthContext } from "../../context/AuthContext.js";
import { Button } from "react-native";
import useMyProfileService from "./use-profile-data.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardScreen() {
  const { logout } = useAuthContext();
  const checkData = async () => {
    try {
      console.log("checkData called");
      const allKeys = await AsyncStorage.getAllKeys();
      const allItems = await AsyncStorage.multiGet(allKeys);
      console.log("Stored items:", allItems);
    } catch (e) {
      console.log("AsyncStorage error:", e);
    }
  };
  useEffect(() => {
    checkData();
  }, []);
  const { profileData } = useMyProfileService();

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
