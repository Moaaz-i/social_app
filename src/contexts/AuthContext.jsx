import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo
} from 'react'
import {useGetProfile} from '../services/profileService'

const AuthContext = createContext({})

const AuthProvider = ({children}) => {
  const [userData, setUserData] = useState(null)
  const [storedToken, setStoredToken] = useState(
    localStorage.getItem('access_token')
  )
  const [error, setError] = useState(null)
  const getProfile = useGetProfile({
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Update userData when profile is loaded
  useEffect(() => {
    if (getProfile.isSuccess && getProfile?.data) {
      setUserData(getProfile.data)
    } else if (getProfile.isError) {
      setUserData(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProfile.isSuccess, getProfile.isError, getProfile.data])

  // Compute isAuthenticated based on token and userData
  const isAuthenticated = useMemo(() => {
    return !!(storedToken && (userData || getProfile.isLoading))
  }, [storedToken, userData, getProfile.isLoading])

  const checkToken = useCallback(() => {
    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        setStoredToken(token)
        setError(null)
        return true
      }
      return false
    } catch (err) {
      setError(err.message || 'Token check failed')
      return false
    }
  }, [])

  const login = useCallback(async (token) => {
    if (token) {
      localStorage.setItem('access_token', token)
      setStoredToken(token)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('access_token')
      setStoredToken(null)
      setUserData(null)
      setError(null)
    } catch (err) {
      setError(err.message || 'Logout failed')
    }
  }, [])

  const value = useMemo(
    () => ({
      userData,
      storedToken,
      login,
      logout,
      checkToken,
      isAuthenticated,
      error
    }),
    [userData, storedToken, login, logout, checkToken, isAuthenticated, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export {AuthContext}
export default AuthProvider
