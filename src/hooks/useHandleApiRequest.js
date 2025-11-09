import axios from "axios";
import { useState } from "react";
import useLoading from "./useLoading";

const useHandleApiRequest = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const { startLoading, stopLoading } = useLoading();

  const handleApiRequest = async (
    url,
    method = "GET",
    body = null,
    headers = {},
    onSuccess = null,
    onError = null,
    onFinally = null,
    loading = true
  ) => {
    if (loading && startLoading) startLoading();

    setError(null);
    setResponse(null);

    const config = {
      url,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.data = body;
    }

    const result = await axios(config)
      .then((response) => {
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(response.data);
        }
        setResponse(response);
        return response.data;
      })
      .catch((error) => {
        const errorResponse =
          error?.response?.data?.error || error?.message || "Unknown error";
        if (onError && typeof onError === "function") {
          onError(errorResponse);
        }
        setError(errorResponse);
        throw error.response.data.error;
      })
      .finally(() => {
        if (loading && stopLoading) stopLoading();
        if (onFinally && typeof onFinally === "function") {
          onFinally();
        }
      });

    return [result, null];
  };

  return {
    handleApiRequest,
    response,
    error,
  };
};

export default useHandleApiRequest;
