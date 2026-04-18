import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
)

const MyProfile = () => {
  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)
  const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!token) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🔒</p>
      <h2 className="text-xl font-display font-700 text-gray-800">Please log in</h2>
      <button onClick={() => navigate('/login')} className="mt-4 bg-primary text-white px-6 py-3 rounded-2xl font-semibold">Go to Login</button>
    </div>
  )

  if (!userData) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const save = async () => {
    setSaving(true)
    try {
      const form = new FormData()
      form.append('name', userData.name)
      form.append('phone', userData.phone)
      form.append('address', JSON.stringify(userData.address))
      form.append('gender', userData.gender)
      form.append('dob', userData.dob)
      if (image) form.append('image', image)

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, form, { headers: { token } })
      if (data.success) {
        toast.success('Profile updated! ✅')
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else toast.error(data.message)
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
  const textCls = "text-sm text-gray-700 py-1"

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-700 text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
        {/* Cover + Avatar */}
        <div className="h-28 bg-gradient-to-r from-primary to-accent relative">
          <div className="absolute -bottom-14 left-8">
            <div className="relative group">
              <img
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="avatar"
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              {isEdit && (
                <label htmlFor="profile-img"
                  className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">📷 Change</span>
                </label>
              )}
              <input type="file" id="profile-img" hidden accept="image/*"
                onChange={e => setImage(e.target.files[0])} />
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          {/* Name + edit button */}
          <div className="flex items-start justify-between mb-8">
            <div>
              {isEdit ? (
                <input value={userData.name}
                  onChange={e => setUserData(p => ({ ...p, name: e.target.value }))}
                  className="text-2xl font-display font-700 text-gray-900 border-b-2 border-primary bg-transparent outline-none pb-0.5 w-64" />
              ) : (
                <h2 className="text-2xl font-display font-700 text-gray-900">{userData.name}</h2>
              )}
              <p className="text-sm text-gray-400 mt-0.5">{userData.email}</p>
            </div>
            {!isEdit ? (
              <button onClick={() => setIsEdit(true)}
                className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all">
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={save} disabled={saving}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-60">
                  {saving ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving</> : '✓ Save'}
                </button>
                <button onClick={() => { setIsEdit(false); setImage(false) }}
                  className="border border-gray-200 text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

            {/* Contact */}
            <div className="space-y-5">
              <h3 className="text-sm font-display font-700 text-gray-900 border-b border-gray-100 pb-2">Contact Information</h3>

              <Field label="Email">
                <p className="text-sm text-blue-500 py-1">{userData.email}</p>
              </Field>

              <Field label="Phone">
                {isEdit
                  ? <input value={userData.phone} onChange={e => setUserData(p => ({ ...p, phone: e.target.value }))} className={inputCls} placeholder="+1 000 000 0000" />
                  : <p className={textCls}>{userData.phone || '—'}</p>}
              </Field>

              <Field label="Address Line 1">
                {isEdit
                  ? <input value={userData.address?.line1 || ''} onChange={e => setUserData(p => ({ ...p, address: { ...p.address, line1: e.target.value } }))} className={inputCls} placeholder="Street address" />
                  : <p className={textCls}>{userData.address?.line1 || '—'}</p>}
              </Field>

              <Field label="Address Line 2">
                {isEdit
                  ? <input value={userData.address?.line2 || ''} onChange={e => setUserData(p => ({ ...p, address: { ...p.address, line2: e.target.value } }))} className={inputCls} placeholder="City, State, ZIP" />
                  : <p className={textCls}>{userData.address?.line2 || '—'}</p>}
              </Field>
            </div>

            {/* Basic Info */}
            <div className="space-y-5">
              <h3 className="text-sm font-display font-700 text-gray-900 border-b border-gray-100 pb-2">Basic Information</h3>

              <Field label="Gender">
                {isEdit
                  ? <select value={userData.gender} onChange={e => setUserData(p => ({ ...p, gender: e.target.value }))} className={inputCls}>
                      <option value="Not Selected">Not Selected</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  : <p className={textCls}>{userData.gender || '—'}</p>}
              </Field>

              <Field label="Date of Birth">
                {isEdit
                  ? <input type="date" value={userData.dob} onChange={e => setUserData(p => ({ ...p, dob: e.target.value }))} className={inputCls} />
                  : <p className={textCls}>{userData.dob || '—'}</p>}
              </Field>

              {/* Quick stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { icon: '📅', label: 'Member since', value: '2024' },
                  { icon: '🩺', label: 'Appointments', value: '—' },
                ].map(s => (
                  <div key={s.label} className="bg-surface rounded-2xl p-4 text-center border border-gray-100">
                    <p className="text-xl mb-1">{s.icon}</p>
                    <p className="text-sm font-semibold text-gray-800">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
