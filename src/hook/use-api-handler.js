// useAPIHandler.js
import { useState } from "react";
import globalApi from "../lib/global-api";

const useAPIHandler = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async ({
    data = null,
    url,
    method = "GET",
    params = {},
    headers = {
      isEmployee: true,
      isMobile: true,
    },
    customToken,
  }) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const isFormData = data instanceof FormData;
      const config = {
        url,
        method,
        params,
        // data: isFormData ? data : JSON.stringify(data),
        headers: {
          ...headers,
          ...(!isFormData && { "Content-Type": "application/json" }),
        },
      };
      if (data !== null && method !== "DELETE") {
        config.data = isFormData ? data : JSON.stringify(data);
      }

      if (customToken) {
        config.customToken = customToken;
      }

      const result = await globalApi(config);

      // If the response includes an error property, extract and throw it
      if (result?.error?.data) {
        const errorDetails = result.error.data; // This can be a validation error or another type of error
        throw errorDetails; // Throw the actual error details
      }

      setResponse(result.data);
      return result.data;
    } catch (err) {
      let errorMessage = "Something went wrong";

      // Check for network or fetch-related errors
      if (err.name === "TypeError" && err.message.includes("NetworkError")) {
        errorMessage = "Network error occurred. Please try again later.";
      }

      // Handle Joi validation errors separately
      if (err?.type === "JoiValidationError" && err.details) {
        const validationErrors = err.details.map((detail) => ({
          field: detail.field,
          message: detail.message,
        }));
        throw { type: err.type, errors: validationErrors };
      }

      // Handle GeneralError specifically (e.g., invalid credentials or general failures)
      if (err?.type === "GeneralError") {
        const generalErrorDetails = {
          message: err.message || "An unknown general error occurred.",
          details: err.details || "No further details provided.",
        };
        throw {
          type: "GeneralError",
          message: generalErrorDetails.message,
          details: generalErrorDetails.details,
        };
      }

      // If it's an HTTP response error, extract status and message if available
      if (err?.response) {
        errorMessage =
          err.response?.data?.message || "An error occurred on the server.";
      }

      // Return or throw structured error
      throw {
        type: err?.type || "UnknownError",
        message: errorMessage,
        details: err,
      };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResponse(null);
    setError(null);
  };

  return { response, error, loading, fetchData, reset };
};

export default useAPIHandler;
