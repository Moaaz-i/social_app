import {Outlet} from 'react-router-dom'
import Navbar from './Navbar/Navbar.jsx'
import Footer from './Footer/footer.jsx'
import useAuth from '../hooks/useAuth'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

const Layout = () => {
  const {isAuthenticated} = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar hide={!isAuthenticated} />

      <Outlet />

      <Footer />
      <ReactQueryDevtools />
    </div>
  )
}

export default Layout
