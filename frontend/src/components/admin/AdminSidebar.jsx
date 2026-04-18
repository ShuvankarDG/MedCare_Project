import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { DoctorContext } from '../../context/DoctorContext'

const adminLinks = [
  { label: 'Dashboard',    path: '/admin/dashboard',    icon: '🏠' },
  { label: 'Appointments', path: '/admin/appointments', icon: '📅' },
  { label: 'Add Doctor',   path: '/admin/add-doctor',   icon: '➕' },
  { label: 'Doctors List', path: '/admin/doctors',      icon: '👨‍⚕️' },
]

const doctorLinks = [
  { label: 'Dashboard',    path: '/admin/doctor-dashboard',    icon: '🏠' },
  { label: 'Appointments', path: '/admin/doctor-appointments', icon: '📅' },
  { label: 'Profile',      path: '/admin/doctor-profile',      icon: '👤' },
]

const AdminSidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const links = aToken ? adminLinks : doctorLinks

  return (
    <aside className='min-h-[calc(100vh-64px)] bg-white border-r w-14 sm:w-52 flex-shrink-0'>
      <nav className='pt-4'>
        {links.map(item => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => (
              <div className={`flex items-center gap-3 py-3 px-3 sm:px-5 cursor-pointer transition-all
                ${isActive
                  ? 'bg-indigo-50 border-r-4 border-primary text-primary'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
              >
                <span className='text-xl flex-shrink-0'>{item.icon}</span>
                <p className='hidden sm:block text-sm font-medium truncate'>{item.label}</p>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar
