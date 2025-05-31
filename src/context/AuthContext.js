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
      phone: "9432499608",
      password: "12345678",
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
      setLoginLoading(false);
      if (response?.data?.employee_id) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error, "login-error");
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };
  const logout = async () => {
    setIsAuthenticated(false);
    setFormData({ phone: "", password: "" });
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
    logout,
    userData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
