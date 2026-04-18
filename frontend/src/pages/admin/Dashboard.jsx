import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat, currencySymbol } = useContext(AppContext)

  useEffect(() => { if (aToken) getDashData() }, [aToken])

  if (!dashData) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-700 mb-5'>Dashboard</h1>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {[
          { label: 'Doctors',      value: dashData.doctors,      icon: '👨‍⚕️', bg: 'bg-blue-50   border-blue-200'   },
          { label: 'Appointments', value: dashData.appointments, icon: '📅',   bg: 'bg-green-50  border-green-200'  },
          { label: 'Patients',     value: dashData.patients,     icon: '🧑‍🤝‍🧑', bg: 'bg-purple-50 border-purple-200' },
          { label: 'Revenue',      value: `${currencySymbol}${dashData.revenue ?? 0}`, icon: '💰', bg: 'bg-yellow-50 border-yellow-200' },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-3 bg-white p-4 rounded-xl border-2 ${s.bg} hover:scale-105 transition-transform`}>
            <span className='text-3xl'>{s.icon}</span>
            <div>
              <p className='text-xl font-bold text-gray-700'>{s.value}</p>
              <p className='text-xs text-gray-400'>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white rounded-xl border overflow-hidden'>
        <div className='flex items-center gap-2 px-5 py-4 border-b bg-gray-50'>
          <span>📋</span>
          <p className='font-semibold text-gray-700'>Latest Appointments</p>
        </div>
        {dashData.latestAppointments.length === 0
          ? <p className='text-center text-gray-400 py-10 text-sm'>No appointments yet</p>
          : <div className='divide-y'>
              {dashData.latestAppointments.map((item, i) => (
                <div key={i} className='flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors'>
                  <img className='w-10 h-10 rounded-full object-cover border flex-shrink-0' src={item.docData.image} alt='' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-800 truncate'>{item.docData.name}</p>
                    <p className='text-xs text-gray-400'>{slotDateFormat(item.slotDate)} · {item.slotTime}</p>
                  </div>
                  <span className='hidden sm:block text-xs text-gray-400 truncate max-w-[100px]'>{item.userData.name}</span>
                  {item.cancelled
                    ? <span className='text-red-400 text-xs font-medium bg-red-50 px-2 py-1 rounded-full flex-shrink-0'>Cancelled</span>
                    : item.isCompleted
                      ? <span className='text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full flex-shrink-0'>Completed</span>
                      : <button onClick={() => cancelAppointment(item._id)}
                          className='text-xs text-red-400 border border-red-300 px-3 py-1 rounded-full hover:bg-red-400 hover:text-white transition-all flex-shrink-0'>
                          Cancel
                        </button>
                  }
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}

export default Dashboard
