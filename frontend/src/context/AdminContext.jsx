import axios from 'axios'
import { createContext, useState } from 'react'
import { toast } from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '')
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, { headers: { atoken: aToken } })
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (e) { toast.error(e.message) }
  }

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, { headers: { atoken: aToken } })
      if (data.success) { toast.success(data.message); getAllDoctors() }
      else toast.error(data.message)
    } catch (e) { toast.error(e.message) }
  }

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, { headers: { atoken: aToken } })
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (e) { toast.error(e.message) }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, { headers: { atoken: aToken } })
      if (data.success) { toast.success(data.message); getAllAppointments() }
      else toast.error(data.message)
    } catch (e) { toast.error(e.message) }
  }

  const deleteDoctor = async (docId) => {
  try {
    const { data } = await axios.post(`${backendUrl}/api/admin/delete-doctor`, { docId }, { headers: { atoken: aToken } })
    if (data.success) { toast.success('Doctor removed'); getAllDoctors() }
    else toast.error(data.message)
  } catch (e) { toast.error(e.message) }
 }

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, { headers: { atoken: aToken } })
      if (data.success) setDashData(data.dashData)
      else toast.error(data.message)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <AdminContext.Provider value={{
      aToken, setAToken, backendUrl,
      doctors, getAllDoctors, changeAvailability,
      appointments, getAllAppointments, cancelAppointment,
      dashData, deleteDoctor, getDashData,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider
