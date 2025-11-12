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
      // Handle both direct calls and form events
      const formEvent = email?.preventDefault ? email : null;
      const emailValue = formEvent ? password : email;
      const passwordValue = formEvent ? null : password;

      if (formEvent) {
        formEvent.preventDefault();
      }

      if (!emailValue || !passwordValue) {
        const errorMsg = "Email and password are required";
        setError(errorMsg);
        return { error: errorMsg };
      }

      setError(null);

      try {
        const result = await loginService.mutateAsync({
          email: emailValue,
          password: passwordValue,
        });

        const userData = await login(result.token);
        if (userData) {
          setLoginData(result);
          return result;
        }

        const errorMessage = "Login failed. Please try again.";
        setError(errorMessage);
        return { error: errorMessage };
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
