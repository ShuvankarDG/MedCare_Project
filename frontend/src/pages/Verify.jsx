import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const appointmentId = searchParams.get('appointmentId')
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading | success | failed

  useEffect(() => {
    if (!token) { navigate('/login'); return }

    const verify = async () => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/verify-stripe`,
          { success, appointmentId },
          { headers: { token } }
        )
        setStatus(data.success ? 'success' : 'failed')
      } catch {
        setStatus('failed')
      } finally {
        setTimeout(() => navigate('/my-appointments'), 2800)
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-12 text-center max-w-sm w-full animate-fadeUp">

        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-display font-700 text-gray-900">Verifying Payment</h2>
            <p className="text-gray-400 text-sm mt-2">Please wait, we're confirming your transaction…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse2">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-display font-700 text-gray-900">Payment Successful!</h2>
            <p className="text-gray-400 text-sm mt-2">Your appointment has been confirmed. Redirecting you…</p>
            <div className="mt-5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-[shimmer_2.5s_linear_forwards]" style={{ width: '100%', animation: 'grow 2.5s linear forwards' }} />
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-xl font-display font-700 text-gray-900">Payment Failed</h2>
            <p className="text-gray-400 text-sm mt-2">Something went wrong. Your appointment was not confirmed. Redirecting…</p>
          </>
        )}

      </div>
    </div>
  )
}

export default Verify
