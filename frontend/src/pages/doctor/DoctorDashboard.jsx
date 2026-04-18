import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currencySymbol } = useContext(AppContext)

  useEffect(() => { if (dToken) getDashData() }, [dToken])

  if (!dashData) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-700 mb-5'>Doctor Dashboard</h1>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        {[
          { label: 'Earnings',     value: `${currencySymbol}${dashData.earnings}`, icon: '💰', bg: 'bg-yellow-50 border-yellow-200' },
          { label: 'Appointments', value: dashData.appointments,                   icon: '📅', bg: 'bg-green-50  border-green-200'  },
          { label: 'Patients',     value: dashData.patients,                       icon: '🧑‍🤝‍🧑', bg: 'bg-blue-50   border-blue-200'   },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-3 bg-white p-5 rounded-xl border-2 ${s.bg} hover:scale-105 transition-transform`}>
            <span className='text-3xl'>{s.icon}</span>
            <div><p className='text-xl font-bold text-gray-700'>{s.value}</p><p className='text-xs text-gray-400'>{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className='bg-white rounded-xl border overflow-hidden'>
        <div className='flex items-center gap-2 px-5 py-4 border-b bg-gray-50'>
          <span>📋</span><p className='font-semibold text-gray-700'>Latest Appointments</p>
        </div>
        {dashData.latestAppointments.length === 0
          ? <p className='text-center text-gray-400 py-10 text-sm'>No appointments yet</p>
          : <div className='divide-y'>
              {dashData.latestAppointments.map((item, i) => (
                <div key={i} className='flex items-center gap-3 px-5 py-3 hover:bg-gray-50'>
                  <img className='w-10 h-10 rounded-full object-cover border flex-shrink-0' src={item.userData.image} alt='' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-800 truncate'>{item.userData.name}</p>
                    <p className='text-xs text-gray-400'>{slotDateFormat(item.slotDate)} · {item.slotTime}</p>
                  </div>
                  {item.cancelled
                    ? <span className='text-red-400 text-xs bg-red-50 px-2 py-1 rounded-full'>Cancelled</span>
                    : item.isCompleted
                      ? <span className='text-green-500 text-xs bg-green-50 px-2 py-1 rounded-full'>Completed</span>
                      : <div className='flex gap-2'>
                          <button onClick={() => cancelAppointment(item._id)} className='w-8 h-8 flex items-center justify-center rounded-full border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-all'>✕</button>
                          <button onClick={() => completeAppointment(item._id)} className='w-8 h-8 flex items-center justify-center rounded-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all'>✓</button>
                        </div>
                  }
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}

export default DoctorDashboard
