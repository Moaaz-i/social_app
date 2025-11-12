import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Loading from '../Loading/Loading'

const ProtectAuth = ({children}) => {
  const {isAuthenticated, userData} = useAuth()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    
    // If has token and is authenticated, redirect to home
    if (token && isAuthenticated) {
      navigate('/')
      setIsChecking(false)
      return
    }

    // Wait for userData to load
    if (token && userData === null) {
      setIsChecking(true)
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, userData, navigate])

  if (isChecking) {
    return <Loading text="Loading..." />
  }

  return children
}

export default ProtectAuth
