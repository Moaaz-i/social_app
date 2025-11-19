import {createContext, useState, useEffect} from 'react'
import {subscribeToLoading} from '../services/api'

const LoadingContext = createContext({})

const LoadingProvider = ({children}) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToLoading((isLoading) => {
      setLoading(isLoading)
    })

    return unsubscribe
  }, [])

  const value = {
    loading
  }

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  )
}

export {LoadingContext}
export default LoadingProvider
