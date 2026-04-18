import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import { DoctorContext } from '../../context/DoctorContext'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { aToken, setAToken, backendUrl } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)

  // Already logged in → redirect
  useEffect(() => {
    if (aToken) navigate('/admin/dashboard')
    if (dToken) navigate('/admin/doctor-dashboard')
  }, [aToken, dToken])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success('Welcome, Admin!')
        } else {
          toast.error(data.message || 'Invalid credentials — check ADMIN_EMAIL & ADMIN_PASSWORD in .env')
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success('Welcome, Doctor!')
        } else {
          toast.error(data.message || 'Invalid credentials')
        }
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK') toast.error('Cannot reach backend — is it running on port 4000?')
      else toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <form onSubmit={onSubmit} className='bg-white rounded-2xl shadow-lg p-8 w-full max-w-md'>

        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>Rx</span>
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Prescripto</h1>
            <p className='text-xs text-gray-400'>Admin Panel</p>
          </div>
        </div>

        <h2 className='text-2xl font-semibold text-gray-700 mb-1'>
          <span className='text-primary'>{state}</span> Login
        </h2>
        <p className='text-sm text-gray-400 mb-6'>
          {state === 'Admin' ? 'Credentials from your backend .env file' : 'Your registered doctor account'}
        </p>

        {/* Toggle */}
        <div className='flex bg-gray-100 rounded-xl p-1 mb-6'>
          {['Admin', 'Doctor'].map(s => (
            <button key={s} type='button' onClick={() => setState(s)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${state === s ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
              {s === 'Admin' ? '🔧 Admin' : '👨‍⚕️ Doctor'}
            </button>
          ))}
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1.5'>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} required type='email'
              placeholder={state === 'Admin' ? 'admin@prescripto.com' : 'doctor@example.com'}
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1.5'>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} required type='password'
              placeholder='••••••••'
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all' />
          </div>
        </div>

        <button type='submit' disabled={loading}
          className='w-full bg-primary hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl mt-6 transition-all flex items-center justify-center gap-2 disabled:opacity-60'>
          {loading
            ? <><div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />Logging in...</>
            : `Sign In as ${state}`}
        </button>

        {state === 'Admin' && (
          <div className='mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100'>
            <p className='text-xs text-blue-600 font-medium'>💡 Set <code className='bg-blue-100 px-1 rounded'>ADMIN_EMAIL</code> and <code className='bg-blue-100 px-1 rounded'>ADMIN_PASSWORD</code> in your backend <code className='bg-blue-100 px-1 rounded'>.env</code></p>
          </div>
        )}

        <button type='button' onClick={() => navigate('/')}
          className='w-full text-center text-sm text-gray-400 hover:text-primary mt-4 transition-colors'>
          ← Back to patient site
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
