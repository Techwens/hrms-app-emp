/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { useState } from "react";
import useAPIHandler from "../../hook/use-api-handler.js";
import * as Device from "expo-device";
import * as Application from "expo-application";

export const useLoginService = () => {
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

  const [loading, setLoading] = useState(false);
  const { fetchData } = useAPIHandler();

  const handleInputChange = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Login function
  const handleLoginSubmit = async (email, password) => {
    setLoading(true);
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
    } catch (error) {
      console.log(error, "login-error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Add any additional logout logic, like clearing tokens
  };

  return {
    loading,
    handleLoginSubmit,
    formErrors,
    showPassword,
    setShowPassword,
    handleInputChange,
    formData,
    logout,
  };
};
