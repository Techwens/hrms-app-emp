import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { logger } from "../utils/logger";
import * as Device from "expo-device";
import * as Application from "expo-application";
import useAPIHandler from "../hook/use-api-handler.js";

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  const deviceInfo = {
    brand: Device.brand,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
  };
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});

  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [testTitle, setTestTitle] = useState("hello-saha");
  const { fetchData } = useAPIHandler();

  const handleInputChange = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Login function
  const handleLoginSubmit = async () => {
    setLoginLoading(true);
    const errors = {};
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);

    // if (Object.keys(errors).length === 0) {
    //   console.log("Logging in with:", formData);
    //   // Implement actual login logic here
    // }

    let deviceId =
      Application.androidId || Device.osInternalBuildId || "unknown";
    if (Application.getIosIdForVendorAsync) {
      try {
        const iosId = await Application.getIosIdForVendorAsync();
        if (iosId) deviceId = iosId;
      } catch (e) {
        // fallback remains
      }
    }

    const payload = {
      // phone: "8910985759",
      phone: "8899889981",
      password: "Links@1234",
      deviceInfo: deviceInfo,
      deviceId: deviceId,
    };

    try {
      const response = await fetchData({
        url: "/auth/signin-employee",
        method: "POST",
        data: payload,
        headers: {
          isMobile: true,
          isEmployee: true,
        },
      });
      console.log(response, "login-response");
      setUserData(response?.data);
      setLogoutLoading(false);
      if (response?.data?.employee_id) {
        setIsAuthenticated(true);
        await AsyncStorage.setItem("hrms_token", response?.data?.accessToken);
        await AsyncStorage.setItem(
          "hrms_refresh_token",
          response?.data?.refresh_token
        );
      }
    } catch (error) {
      console.log(error, "login-error");
      throw error;
    } finally {
      setLogoutLoading(false);
    }
  };
  const handleLogoutClick = async () => {
    console.log("click logout");
    try {
      setLogoutLoading(true);
      const response = await fetchData({
        url: "/auth/logout",
        method: "POST",
      });
      console.log(response, "logout-response");
      await AsyncStorage.removeItem("hrms_token");
      setIsAuthenticated(false);
      setFormData({ phone: "", password: "" });
      setLogoutLoading(false);
    } catch (error) {
      console.log(error, "logout-error");
      throw error;
    } finally {
      setLogoutLoading(false);
    }
  };
  const value = {
    loginLoading,
    handleLoginSubmit,
    formErrors,
    showPassword,
    setShowPassword,
    handleInputChange,
    formData,
    isAuthenticated,
    handleLogoutClick,
    userData,
    testTitle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
