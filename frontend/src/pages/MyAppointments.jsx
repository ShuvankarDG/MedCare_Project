import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const STATUS = {
  cancelled: { label: 'Cancelled', classes: 'bg-red-50 text-red-500 border-red-200' },
  completed: { label: 'Completed', classes: 'bg-green-50 text-green-600 border-green-200' },
  paid: { label: 'Paid', classes: 'bg-blue-50 text-blue-600 border-blue-200' },
  pending: { label: 'Pending', classes: 'bg-amber-50 text-amber-600 border-amber-200' },
}

const MyAppointments = () => {
  const { backendUrl, token, slotDateFormat, currencySymbol } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [paying, setPaying] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const navigate = useNavigate()

  const getStatus = (item) => {
    if (item.cancelled) return 'cancelled'
    if (item.isCompleted) return 'completed'
    if (item.payment) return 'paid'
    return 'pending'
  }

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
      if (data.success) setAppointments(data.appointments.reverse())
    } catch { toast.error('Failed to load appointments') }
    finally { setLoading(false) }
  }

  const cancelAppointment = async (id) => {
    setCancelling(id)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId: id }, { headers: { token } })
      if (data.success) { toast.success('Appointment cancelled'); fetchAppointments() }
      else toast.error(data.message)
    } catch { toast.error('Failed to cancel') }
    finally { setCancelling(null) }
  }

  const payOnline = async (item) => {
    setPaying(item._id)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment-stripe`,
        { appointmentId: item._id },
        { headers: { token, origin: window.location.origin } })
      if (data.success) window.location.replace(data.session_url)
      else toast.error(data.message)
    } catch { toast.error('Payment failed') }
    finally { setPaying(null) }
  }

  useEffect(() => { if (token) fetchAppointments() }, [token])

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'paid', label: 'Paid' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  const filtered = activeTab === 'all' ? appointments : appointments.filter(a => getStatus(a) === activeTab)

  if (!token) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🔒</p>
      <h2 className="text-xl font-display font-700 text-gray-800">Please log in</h2>
      <p className="text-gray-500 mt-2 mb-6 text-sm">You need to be logged in to view your appointments.</p>
      <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 py-3 rounded-2xl font-semibold">Go to Login</button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-700 text-gray-900">My Appointments</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage and track all your upcoming and past appointments</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-primary/40'}`}>
            {tab.label}
            {tab.key !== 'all' && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100'}`}>
                {appointments.filter(a => getStatus(a) === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-gray-700 font-semibold">No appointments found</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            {activeTab === 'all' ? "You haven't booked any appointments yet." : `No ${activeTab} appointments.`}
          </p>
          {activeTab === 'all' && (
            <button onClick={() => navigate('/doctors')} className="bg-primary text-white px-6 py-3 rounded-2xl font-semibold text-sm">
              Find a Doctor
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const status = getStatus(item)
            const statusConfig = STATUS[status]
            return (
              <div key={item._id} className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  {/* Doctor image */}
                  <div className="sm:w-28 flex-shrink-0 bg-gradient-to-br from-primary-light to-blue-50">
                    <img src={item.docData.image} alt={item.docData.name}
                      className="w-full h-28 object-cover object-top" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-700 text-gray-900">{item.docData.name}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusConfig.classes}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-primary text-sm font-medium mt-0.5">{item.docData.speciality}</p>

                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <span>📅</span>
                          <span>{slotDateFormat(item.slotDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <span>🕐</span>
                          <span>{item.slotTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <span>💰</span>
                          <span className="font-semibold text-gray-700">{currencySymbol}{item.amount}</span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-400">
                        📍 {item.docData.address?.line1}{item.docData.address?.line2 ? `, ${item.docData.address.line2}` : ''}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 items-start sm:items-end justify-end flex-wrap">
                      {status === 'pending' && (
                        <>
                          <button onClick={() => payOnline(item)} disabled={paying === item._id}
                            className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-glow disabled:opacity-60">
                            {paying === item._id ? (
                              <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing</>
                            ) : '💳 Pay Online'}
                          </button>
                          <button onClick={() => cancelAppointment(item._id)} disabled={cancelling === item._id}
                            className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-60">
                            {cancelling === item._id ? (
                              <><div className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> Cancelling</>
                            ) : '✕ Cancel'}
                          </button>
                        </>
                      )}
                      {status === 'paid' && (
                        <button onClick={() => cancelAppointment(item._id)} disabled={cancelling === item._id}
                          className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-60">
                          {cancelling === item._id ? (
                            <><div className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> Cancelling</>
                          ) : '✕ Cancel'}
                        </button>
                      )}
                      {status === 'completed' && (
                        <button onClick={() => navigate('/doctors')}
                          className="border border-primary text-primary hover:bg-primary-light text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                          Book Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyAppointments
