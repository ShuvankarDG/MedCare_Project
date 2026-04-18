import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currencySymbol } = useContext(AppContext)

  useEffect(() => { if (aToken) getAllAppointments() }, [aToken])

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-700 mb-5'>All Appointments</h1>
      <div className='bg-white rounded-xl border overflow-hidden'>
        <div className='hidden sm:grid grid-cols-[0.4fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-2 py-3 px-5 bg-gray-50 border-b text-xs font-semibold text-gray-400 uppercase tracking-wide'>
          <p>#</p><p>Patient</p><p>Age</p><p>Date & Time</p><p>Doctor</p><p>Fee</p><p>Status</p>
        </div>
        <div className='max-h-[70vh] overflow-y-auto divide-y'>
          {appointments.length === 0
            ? <p className='text-center text-gray-400 py-12 text-sm'>No appointments found</p>
            : appointments.map((item, i) => (
                <div key={i} className='flex flex-col sm:grid sm:grid-cols-[0.4fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-2 items-start sm:items-center text-sm text-gray-600 py-3 px-5 hover:bg-gray-50'>
                  <p className='hidden sm:block text-gray-400'>{i + 1}</p>
                  <div className='flex items-center gap-2'>
                    <img className='w-8 h-8 rounded-full object-cover border flex-shrink-0' src={item.userData.image} alt='' />
                    <p className='font-medium text-gray-800 truncate'>{item.userData.name}</p>
                  </div>
                  <p className='hidden sm:block'>{calculateAge(item.userData.dob)}</p>
                  <div>
                    <p className='font-medium'>{slotDateFormat(item.slotDate)}</p>
                    <p className='text-xs text-gray-400'>{item.slotTime}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <img className='w-8 h-8 rounded-full object-cover border flex-shrink-0' src={item.docData.image} alt='' />
                    <p className='truncate'>{item.docData.name}</p>
                  </div>
                  <p className='font-semibold'>{currencySymbol}{item.amount}</p>
                  <div>
                    {item.cancelled
                      ? <span className='text-red-400 text-xs bg-red-50 px-2 py-1 rounded-full'>Cancelled</span>
                      : item.isCompleted
                        ? <span className='text-green-500 text-xs bg-green-50 px-2 py-1 rounded-full'>Completed</span>
                        : <div className='flex items-center gap-1'>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${item.payment ? 'text-green-600 border-green-300 bg-green-50' : 'text-yellow-600 border-yellow-300 bg-yellow-50'}`}>
                              {item.payment ? 'Paid' : 'Pending'}
                            </span>
                            <button onClick={() => cancelAppointment(item._id)}
                              className='w-6 h-6 flex items-center justify-center text-red-400 border border-red-300 rounded-full hover:bg-red-400 hover:text-white transition-all text-xs'>✕</button>
                          </div>
                    }
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default AllAppointments
