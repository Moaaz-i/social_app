import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUser, FiMail, FiEye, FiUserPlus, FiEyeOff } from "react-icons/fi";
import useSignup from "../hooks/useSignup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("male");

  const schema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      rePassword: z.string(),
      dateOfBirth: z.string().min(1, "Date of birth is required"),
    })
    .refine((data) => data.password === data.rePassword, {
      message: "Passwords do not match",
      path: ["rePassword"],
    })
    .refine(() => gender === "male" || gender === "female", {
      message: "Gender must be either 'male' or 'female'",
      path: ["gender"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { signup, error } = useSignup();

  const onSubmit = async (data) => {
    const { name, email, password, rePassword, dateOfBirth } = data;
    const result = await signup(name, email, password, rePassword, gender, dateOfBirth);
    if (result && !result.error) {
      navigate('/login');
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create New Account
            </h1>
            <p className="text-gray-600">
              Fill out the form below to create an account
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1 mr-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={`block w-full pr-10 pl-4 py-3 border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your full name"
                  dir="ltr"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 mr-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`block w-full pr-10 pl-4 py-3 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="example@example.com"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-1 mr-2"
              >
                Date of Birth
              </label>
              <div className="relative">
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className={`block w-full pl-4 pr-10 py-3 border ${
                    errors.dateOfBirth ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="flex space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="male"
                    {...register("gender")}
                    onChange={(e) => setGender(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ml-2"
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="female"
                    onChange={(e) => setGender(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ml-2"
                  />
                  <span className="text-gray-700">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 mr-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`block w-full pr-10 pl-4 py-3 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 z-10 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="rePassword"
                className="block text-sm font-medium text-gray-700 mb-1 mr-2"
              >
                Re-Password
              </label>
              <div className="relative">
                <input
                  id="rePassword"
                  type={showRePassword ? "text" : "password"}
                  {...register("rePassword")}
                  className={`block w-full pr-10 pl-4 py-3 border ${
                    errors.rePassword ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 z-10 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowRePassword(!showRePassword)}
                >
                  {showRePassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
              {errors.rePassword && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors.rePassword.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 pt-2">
              <div className="w-full">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <FiUserPlus className="ml-2" />
                    Sign Up
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
