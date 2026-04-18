import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    if (doctors.length > 0) {
      setDocInfo(doctors.find(d => d._id === docId) || null)
    }
  }, [doctors, docId])

  useEffect(() => {
    if (!docInfo) return
    const slots = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const endTime = new Date(date)
      endTime.setHours(21, 0, 0, 0)

      if (i === 0) {
        date.setHours(date.getHours() > 10 ? date.getHours() + 1 : 10)
        date.setMinutes(date.getMinutes() > 30 ? 30 : 0)
      } else {
        date.setHours(10, 0, 0, 0)
      }

      const daySlots = []
      while (date < endTime) {
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
        const isBooked = docInfo.slots_booked[slotDate]?.includes(time)
        if (!isBooked) daySlots.push({ datetime: new Date(date), time })
        date.setMinutes(date.getMinutes() + 30)
      }
      slots.push(daySlots)
    }
    setDocSlots(slots)
  }, [docInfo])

  const bookAppointment = async () => {
    if (!token) { toast.warn('Please login to book'); return navigate('/login') }
    if (!slotTime) { toast.warn('Please select a time slot'); return }
    setBooking(true)
    try {
      const date = docSlots[slotIndex][0].datetime
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
      const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`, { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success('Appointment booked! 🎉')
        getDoctorsData()
        navigate('/my-appointments')
      } else toast.error(data.message)
    } catch { toast.error('Booking failed') } finally { setBooking(false) }
  }

  if (!docInfo) return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 text-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">

      {/* Doctor Info Card */}
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden mb-8">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-56 flex-shrink-0 bg-gradient-to-br from-primary-light to-blue-100">
            <img src={docInfo.image} alt={docInfo.name} className="w-full h-56 sm:h-full object-cover object-top" />
          </div>

          {/* Info */}
          <div className="p-7 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-display font-700 text-gray-900">{docInfo.name}</h1>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Verified
                  </span>
                </div>
                <p className="text-gray-500 mt-1 text-sm">{docInfo.degree} · {docInfo.speciality}</p>
                <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{docInfo.experience} Experience</span>
              </div>
              <div className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${docInfo.available ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${docInfo.available ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                {docInfo.available ? 'Available' : 'Unavailable'}
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-1.5">About</p>
              <p className="text-sm text-gray-500 leading-relaxed">{docInfo.about}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Consultation Fee</p>
                <p className="text-xl font-display font-700 text-primary">{currencySymbol}{docInfo.fees}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Address</p>
                <p className="text-sm text-gray-600">{docInfo.address?.line1}</p>
                <p className="text-sm text-gray-500">{docInfo.address?.line2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-7 mb-8">
        <h2 className="text-lg font-display font-700 text-gray-900 mb-6">Select Appointment Slot</h2>

        {/* Day Picker */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Choose Date</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {docSlots.map((daySlots, i) => {
              if (!daySlots[0]) return null
              const d = daySlots[0].datetime
              const isSelected = slotIndex === i
              return (
                <button key={i} onClick={() => { setSlotIndex(i); setSlotTime('') }}
                  className={`slot-btn flex-shrink-0 flex flex-col items-center w-16 py-3 rounded-2xl border-2 transition-all ${isSelected ? 'active bg-primary border-primary text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-primary/30'}`}>
                  <span className="text-xs font-medium">{DAY_NAMES[d.getDay()]}</span>
                  <span className="text-xl font-display font-700 mt-0.5">{d.getDate()}</span>
                  <span className="text-xs opacity-70">{MONTHS[d.getMonth()]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Time Picker */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Available Times
            {docSlots[slotIndex]?.length > 0 &&
              <span className="ml-2 normal-case font-normal text-gray-400">({docSlots[slotIndex].length} slots)</span>
            }
          </p>
          {docSlots[slotIndex]?.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No slots available for this day</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {docSlots[slotIndex]?.map((s, i) => (
                <button key={i} onClick={() => setSlotTime(s.time)}
                  className={`slot-btn px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${slotTime === s.time ? 'active bg-primary border-primary text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-primary/40 hover:bg-primary-light hover:text-primary'}`}>
                  {s.time}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 flex items-center gap-4">
          <button onClick={bookAppointment} disabled={booking || !slotTime}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-2xl transition-all duration-200 shadow-md hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed">
            {booking ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Booking...</>
            ) : '📅 Confirm Appointment'}
          </button>
          {slotTime && (
            <p className="text-sm text-gray-500 animate-fadeIn">
              Selected: <span className="font-semibold text-gray-800">{slotTime}</span>
            </p>
          )}
        </div>
      </div>

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  )
}

export default Appointment
