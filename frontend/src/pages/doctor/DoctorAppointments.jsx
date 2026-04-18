import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currencySymbol } = useContext(AppContext)

  useEffect(() => { if (dToken) getAppointments() }, [dToken])

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-700 mb-5'>My Appointments</h1>
      <div className='bg-white rounded-xl border overflow-hidden'>
        <div className='hidden sm:grid grid-cols-[0.4fr_2fr_1fr_1fr_2.5fr_1fr_1fr] gap-2 py-3 px-5 bg-gray-50 border-b text-xs font-semibold text-gray-400 uppercase tracking-wide'>
          <p>#</p><p>Patient</p><p>Pay</p><p>Age</p><p>Date & Time</p><p>Fee</p><p>Action</p>
        </div>
        <div className='max-h-[70vh] overflow-y-auto divide-y'>
          {appointments.length === 0
            ? <p className='text-center text-gray-400 py-12 text-sm'>No appointments yet</p>
            : appointments.map((item, i) => (
                <div key={i} className='flex flex-col sm:grid sm:grid-cols-[0.4fr_2fr_1fr_1fr_2.5fr_1fr_1fr] gap-2 items-start sm:items-center text-sm text-gray-600 py-3 px-5 hover:bg-gray-50'>
                  <p className='hidden sm:block text-gray-400'>{i + 1}</p>
                  <div className='flex items-center gap-2'>
                    <img className='w-8 h-8 rounded-full object-cover border flex-shrink-0' src={item.userData.image} alt='' />
                    <p className='font-medium text-gray-800 truncate'>{item.userData.name}</p>
                  </div>
                  <span className={`text-xs border px-2 py-0.5 rounded-full w-fit ${item.payment ? 'border-green-400 text-green-600 bg-green-50' : 'border-yellow-400 text-yellow-600 bg-yellow-50'}`}>
                    {item.payment ? 'Paid' : 'Cash'}
                  </span>
                  <p className='hidden sm:block text-gray-400'>{calculateAge(item.userData.dob)}</p>
                  <div>
                    <p>{slotDateFormat(item.slotDate)}</p>
                    <p className='text-xs text-gray-400'>{item.slotTime}</p>
                  </div>
                  <p className='font-semibold'>{currencySymbol}{item.amount}</p>
                  <div>
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
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
