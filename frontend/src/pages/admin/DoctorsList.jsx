import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, deleteDoctor } = useContext(AdminContext)

  useEffect(() => { if (aToken) getAllDoctors() }, [aToken])

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-700 mb-5'>All Doctors</h1>
      {doctors.length === 0
        ? <div className='text-center py-20 bg-white rounded-xl border'>
            <p className='text-4xl mb-3'>👨‍⚕️</p>
            <p className='text-gray-500 font-medium'>No doctors added yet</p>
            <p className='text-gray-400 text-sm mt-1'>Go to "Add Doctor" to get started</p>
          </div>
        : <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {doctors.map((doc, i) => (
              <div key={i} className='bg-white rounded-xl border overflow-hidden group hover:shadow-md transition-shadow'>
                <div className='relative h-40 overflow-hidden bg-indigo-50'>
                  <img src={doc.image} alt={doc.name}
                    className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300' />
                  <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white ${doc.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div className='p-3'>
                  <p className='font-semibold text-gray-800 text-sm truncate'>{doc.name}</p>
                  <p className='text-primary text-xs mt-0.5 truncate'>{doc.speciality}</p>
                  <div className='flex items-center justify-between mt-2'>
                  <div className='flex items-center gap-1.5'>
                    <input
                      type='checkbox' checked={doc.available} readOnly onChange={() => changeAvailability(doc._id)}
                      className='cursor-pointer accent-primary w-3.5 h-3.5' />
                    <span className='text-xs text-gray-500'>{doc.available ? 'Available' : 'Unavailable'}</span>
                  </div>
                  <button
                    onClick={() => deleteDoctor(doc._id)}
                    className='text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all'
                    title='Remove doctor'
                  >
                    🗑️
                  </button>
                </div>
                  {doc.rating > 0 && <p className='text-xs text-amber-500 mt-1'>⭐ {doc.rating} ({doc.totalReviews})</p>}
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

export default DoctorsList
