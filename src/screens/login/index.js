import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather"; // for eye toggle
import { MaterialIcons } from "@expo/vector-icons"; // for phone icon
import { useLoginService } from "./use-login-service.js";
import { useAuthContext } from "../../context/AuthContext.js";

export default function LoginScreen() {
  // const {
  //   loading,
  //   handleLoginSubmit,
  //   formErrors,
  //   showPassword,
  //   setShowPassword,
  //   handleInputChange,
  //   formData,
  //   logout,
  // } = useLoginService();
  // const [formErrors, setFormErrors] = useState({});
  // const [showPassword, setShowPassword] = useState(false);

  // console.log(formData, "login-formData");

  const {
    loginLoading,
    handleLoginSubmit,
    formErrors,
    showPassword,
    setShowPassword,
    handleInputChange,
    formData,
  } = useAuthContext();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Enter Your Phone No</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="phone" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={formData?.phone}
            onChangeText={(text) => handleInputChange(text, "phone")}
          />
        </View>
        {formErrors?.phone && (
          <Text style={styles.errorText}>{formErrors.phone}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Enter Your Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formData?.password}
            onChangeText={(text) => handleInputChange(text, "password")}
          />
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Icon name={showPassword ? "eye" : "eye-off"} size={20} />
          </TouchableOpacity>
        </View>
        {formErrors?.password && (
          <Text style={styles.errorText}>{formErrors.password}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLoginSubmit}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
  },
  linkText: {
    color: "#007bff",
  },
});
