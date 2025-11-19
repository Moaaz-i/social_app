import { useState, useCallback } from "react";
import { useLogin as useLoginService } from "../services/authService";
import useAuth from "./useAuth";

const useLogin = () => {
  const [loginData, setLoginData] = useState(null);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const loginService = useLoginService();

  const Login = useCallback(
    async (email, password) => {
      if (!email || !password) {
        const errorMsg = "Email and password are required";
        setError(errorMsg);
        return { error: errorMsg };
      }

      setError(null);

      try {
        const result = await loginService.mutateAsync({
          email: email,
          password: password,
        });

        await login(result.token);
        setLoginData(result);
        return result;
      } catch (err) {
        console.error("Login error:", err);
        const errorMessage =
          err.error ||
          "Login failed. Please try again.";
        setError(errorMessage);
        return { error: errorMessage };
      }
    },
    [login, loginService]
  );

  return { Login, loginData, error };
};

export default useLogin;
