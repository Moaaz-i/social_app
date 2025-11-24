import { useState } from "react";
import { useSignup as useSignupService } from "../services/authService";

const useSignup = () => {
  const [signupData, setSignupData] = useState(null);
  const [error, setError] = useState(null);
  const signupService = useSignupService();

  const signup = async (
    name,
    email,
    password,
    rePassword,
    gender,
    dateOfBirth
  ) => {
    try {
      const response = await signupService.mutateAsync({
        name,
        email,
        password,
        rePassword,
        gender,
        dateOfBirth,
      });

      if (response) {
        setSignupData(response);
        return response;
      }

    } catch (error) {
      const errorMessage = error || "Signup failed";
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  return { signup, signupData, error, signupService };
};

export default useSignup;
