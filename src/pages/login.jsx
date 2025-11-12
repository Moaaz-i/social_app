import useLogin from '../hooks/useLogin'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {Link, useNavigate} from 'react-router-dom'
import {FiMail, FiLock, FiLogIn} from 'react-icons/fi'
import useAuth from '../hooks/useAuth'
import {useEffect, useState} from 'react'

const Login = () => {
  const navigate = useNavigate()
  const {userData} = useAuth()
  const [loginSuccess, setLoginSuccess] = useState(false)
  const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
  })

  // Navigate to home when userData is available after successful login
  useEffect(() => {
    if (loginSuccess && userData) {
      navigate('/')
    }
  }, [loginSuccess, userData, navigate])

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting, isValid}
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  })

  const {Login, error, isLoading} = useLogin()

  const onSubmit = async (data) => {
    const result = await Login(data.email, data.password)
    if (result && !result.error) {
      setLoginSuccess(true)
    } else {
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <FiLogIn className="text-white text-3xl" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to continue to your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 animate-shake">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2 mr-2"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`block w-full pr-12 pl-4 py-3.5 border-2 ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  } rounded-xl shadow-sm focus:ring-4 transition-all duration-200 bg-gray-50 focus:bg-white`}
                  placeholder="your@email.com"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 text-left flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mr-2"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={`block w-full pr-12 pl-4 py-3.5 border-2 ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  } rounded-xl shadow-sm focus:ring-4 transition-all duration-200 bg-gray-50 focus:bg-white`}
                  placeholder="Enter your password"
                  dir="ltr"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 text-left flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isValid || isLoading || isSubmitting}
                className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white ${
                  !isValid || isLoading || isSubmitting
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
                } focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200`}
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
                    <FiLogIn className="ml-2" />
                    Login
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New here?</span>
              </div>
            </div>
            <Link
              to="/signup"
              className="mt-4 inline-block font-semibold text-blue-600 hover:text-purple-600 transition-colors"
            >
              Create an account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
