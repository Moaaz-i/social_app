import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup as useSignupService } from "../services/authService";

const useSignup = () => {
  const [signupData, setSignupData] = useState(null);
  const [error, setError] = useState(null);
  const signupService = useSignupService();

  const navigate = useNavigate();
  const signup = async (
    name,
    email,
    password,
    rePassword,
    gender,
    dateOfBirth
  ) => {
    const response = await signupService.mutate({
      name,
      email,
      password,
      rePassword,
      gender,
      dateOfBirth,
    });

    if (response) {
      setSignupData(response);
      navigate("/login");
    }

    if (response.error) {
      setError(response.error);
    }
  };

  return { signup, signupData, error, signupService };
};

export default useSignup;
