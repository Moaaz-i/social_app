import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Loading from '../Loading/Loading'

const ProtectRoute = ({children}) => {
  const {isAuthenticated, userData} = useAuth()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      setIsChecking(false)
      return
    }

    if (!isAuthenticated && userData === null) {
      setIsChecking(true)
    } else if (!isAuthenticated) {
      navigate('/login')
      setIsChecking(false)
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, userData, navigate])

  if (isChecking) {
    return <Loading text="Verifying authentication..." />
  }

  return children
}

export default ProtectRoute
