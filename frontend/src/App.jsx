import React, { useContext } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Patient layout
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

// Admin layout
import AdminNavbar from './components/admin/AdminNavbar'
import AdminSidebar from './components/admin/AdminSidebar'

// Patient pages
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Verify from './pages/Verify'

// Admin/Doctor pages
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import AllAppointments from './pages/admin/AllAppointments'
import AddDoctor from './pages/admin/AddDoctor'
import DoctorsList from './pages/admin/DoctorsList'
import EditDoctor from './pages/admin/EditDoctor'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'

import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'

const AdminGuard = ({ children }) => {
  const { aToken } = useContext(AdminContext)
  if (!aToken) return <Navigate to='/admin' replace />
  return children
}

const DoctorGuard = ({ children }) => {
  const { dToken } = useContext(DoctorContext)
  if (!dToken) return <Navigate to='/admin' replace />
  return children
}

const AdminLayout = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  if (!aToken && !dToken) {
    return (
      <Routes>
        <Route path='/' element={<AdminLogin />} />
        <Route path='*' element={<Navigate to='/admin' replace />} />
      </Routes>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AdminNavbar />
      <div className='flex'>
        <AdminSidebar />
        <main className='flex-1 p-4 sm:p-6 overflow-auto min-h-[calc(100vh-64px)]'>
          <Routes>
            <Route path='/' element={<Navigate to={aToken ? '/admin/dashboard' : '/admin/doctor-dashboard'} replace />} />
            <Route path='/dashboard'           element={<AdminGuard><Dashboard /></AdminGuard>} />
            <Route path='/appointments'        element={<AdminGuard><AllAppointments /></AdminGuard>} />
            <Route path='/add-doctor'          element={<AdminGuard><AddDoctor /></AdminGuard>} />
            <Route path='/doctors'             element={<AdminGuard><DoctorsList /></AdminGuard>} />
            <Route path='/edit-doctor/:docId' element={<AdminGuard><EditDoctor /></AdminGuard>} />
            <Route path='/doctor-dashboard'    element={<DoctorGuard><DoctorDashboard /></DoctorGuard>} />
            <Route path='/doctor-appointments' element={<DoctorGuard><DoctorAppointments /></DoctorGuard>} />
            <Route path='/doctor-profile'      element={<DoctorGuard><DoctorProfile /></DoctorGuard>} />
            <Route path='*'                    element={<Navigate to='/admin' replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

const App = () => {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} theme='light' />

      {isAdmin ? (
        <Routes>
          <Route path='/admin/*' element={<AdminLayout />} />
        </Routes>
      ) : (
        <div className='min-h-screen bg-surface'>
          <Navbar />
          <main>
            <Routes>
              <Route path='/'                    element={<Home />} />
              <Route path='/doctors'             element={<Doctors />} />
              <Route path='/doctors/:speciality' element={<Doctors />} />
              <Route path='/login'               element={<Login />} />
              <Route path='/about'               element={<About />} />
              <Route path='/contact'             element={<Contact />} />
              <Route path='/my-profile'          element={<MyProfile />} />
              <Route path='/my-appointments'     element={<MyAppointments />} />
              <Route path='/appointment/:docId'  element={<Appointment />} />
              <Route path='/verify'              element={<Verify />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      )}
    </>
  )
}

export default App
