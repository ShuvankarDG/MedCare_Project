import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const iCls = 'border border-gray-200 rounded-xl px-3 py-2.5 w-full text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currencySymbol } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [saving, setSaving] = useState(false)

  const updateProfile = async () => {
    setSaving(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`,
        { address: profileData.address, fees: profileData.fees, available: profileData.available },
        { headers: { dtoken: dToken } })
      if (data.success) { toast.success(data.message); setIsEdit(false); getProfileData() }
      else toast.error(data.message)
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  useEffect(() => { if (dToken) getProfileData() }, [dToken])

  if (!profileData) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-700 mb-5'>My Profile</h1>
      <div className='bg-white rounded-xl border overflow-hidden'>
        <div className='h-24 bg-gradient-to-r from-primary to-indigo-500' />
        <div className='px-6 pb-6'>
          <div className='-mt-12 mb-4'>
            <img src={profileData.image} alt={profileData.name} className='w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md' />
          </div>
          <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>{profileData.name}</h2>
              <p className='text-gray-500 text-sm mt-0.5'>{profileData.degree} · {profileData.speciality}</p>
              <span className='inline-block mt-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full'>{profileData.experience}</span>
              {profileData.rating > 0 && <p className='text-amber-500 text-sm mt-1.5'>⭐ {profileData.rating} ({profileData.totalReviews} reviews)</p>}
            </div>
            {!isEdit
              ? <button onClick={() => setIsEdit(true)} className='flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0'>✏️ Edit</button>
              : <div className='flex gap-2 flex-shrink-0'>
                  <button onClick={updateProfile} disabled={saving} className='flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60'>
                    {saving ? <><div className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin' />Saving</> : '✓ Save'}
                  </button>
                  <button onClick={() => { setIsEdit(false); getProfileData() }} className='border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm'>Cancel</button>
                </div>
            }
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>About</label>
                <p className='text-sm text-gray-600 leading-relaxed'>{profileData.about}</p>
              </div>
              <div>
                <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>Consultation Fee</label>
                {isEdit
                  ? <input type='number' value={profileData.fees} onChange={e => setProfileData(p => ({ ...p, fees: e.target.value }))} className={iCls} />
                  : <p className='text-lg font-bold text-primary'>{currencySymbol}{profileData.fees}</p>}
              </div>
            </div>
            <div className='space-y-4'>
              {['line1', 'line2'].map((line, i) => (
                <div key={line}>
                  <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>Address Line {i + 1}</label>
                  {isEdit
                    ? <input value={profileData.address?.[line] || ''} className={iCls}
                        onChange={e => setProfileData(p => ({ ...p, address: { ...p.address, [line]: e.target.value } }))} />
                    : <p className='text-sm text-gray-700'>{profileData.address?.[line] || '—'}</p>}
                </div>
              ))}
              <div className='flex items-center gap-2 mt-2'>
                <input type='checkbox' id='avail' checked={profileData.available}
                  onChange={() => isEdit && setProfileData(p => ({ ...p, available: !p.available }))}
                  className='w-4 h-4 accent-primary cursor-pointer' />
                <label htmlFor='avail' className='text-sm text-gray-600 cursor-pointer'>
                  {profileData.available ? '✅ Available for appointments' : '🔴 Not available'}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
