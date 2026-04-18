import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$"
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(localStorage.getItem("token") || false)
  const [userData, setUserData] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(true)

  const getDoctorsData = async () => {
    setLoadingDoctors(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`)
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch {
      toast.error("Failed to load doctors")
    } finally {
      setLoadingDoctors(false)
    }
  }

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } })
      if (data.success) setUserData(data.userData)
      else toast.error(data.message)
    } catch {
      toast.error("Failed to load profile")
    }
  }

  const slotDateFormat = (slotDate) => {
    const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const [d, m, y] = slotDate.split('_')
    return `${d} ${months[Number(m)]} ${y}`
  }

  const calculateAge = (dob) => {
    if (!dob || dob === 'Not Selected') return '—'
    return new Date().getFullYear() - new Date(dob).getFullYear()
  }

  useEffect(() => { getDoctorsData() }, [])
  useEffect(() => {
    if (token) loadUserProfileData()
    else setUserData(false)
  }, [token])

  return (
    <AppContext.Provider value={{
      doctors, getDoctorsData, loadingDoctors,
      currencySymbol, backendUrl,
      token, setToken,
      userData, setUserData, loadUserProfileData,
      slotDateFormat, calculateAge,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
