import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'

const SPECIALITIES = ['General physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist']
const EXPERIENCES  = ['1 Year','2 Year','3 Year','4 Year','5 Year','6 Year','7 Year','8 Year','9 Year','10 Year']
const iCls = 'border border-gray-200 rounded-xl px-3 py-2.5 w-full text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'

const AddDoctor = () => {
  const { backendUrl, aToken } = useContext(AdminContext)
  const [docImg, setDocImg]   = useState(false)
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [experience, setExp]  = useState('1 Year')
  const [fees, setFees]       = useState('')
  const [about, setAbout]     = useState('')
  const [speciality, setSpec] = useState('General physician')
  const [degree, setDeg]      = useState('')
  const [addr1, setAddr1]     = useState('')
  const [addr2, setAddr2]     = useState('')
  const [submitting, setSub]  = useState(false)

  const reset = () => {
    setDocImg(false); setName(''); setEmail(''); setPass('');
    setFees(''); setAbout(''); setDeg(''); setAddr1(''); setAddr2('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!docImg) return toast.error('Please select a doctor photo')
    setSub(true)
    try {
      const fd = new FormData()
      fd.append('image', docImg); fd.append('name', name); fd.append('email', email)
      fd.append('password', password); fd.append('experience', experience)
      fd.append('fees', Number(fees)); fd.append('about', about)
      fd.append('speciality', speciality); fd.append('degree', degree)
      fd.append('address', JSON.stringify({ line1: addr1, line2: addr2 }))
      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, fd, { headers: { atoken: aToken } })
      if (data.success) { toast.success('Doctor added!'); reset() }
      else toast.error(data.message)
    } catch (e) { toast.error(e.message) }
    finally { setSub(false) }
  }

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-700 mb-5'>Add New Doctor</h1>
      <form onSubmit={onSubmit} className='bg-white rounded-xl border p-6'>
        <div className='flex items-center gap-4 mb-6'>
          <label htmlFor='doc-img' className='cursor-pointer group'>
            <div className='w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 group-hover:border-primary transition-colors flex items-center justify-center'>
              {docImg ? <img className='w-full h-full object-cover' src={URL.createObjectURL(docImg)} alt='' /> : <span className='text-3xl'>📷</span>}
            </div>
          </label>
          <input id='doc-img' type='file' accept='image/*' hidden onChange={e => setDocImg(e.target.files[0])} />
          <div>
            <p className='text-sm font-medium text-gray-700'>Doctor Photo</p>
            <p className='text-xs text-gray-400 mt-0.5'>Click to upload (JPG, PNG)</p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            {[
              { label: 'Full Name',   val: name,     set: setName,  ph: 'Dr. John Smith',      type: 'text'     },
              { label: 'Email',       val: email,    set: setEmail, ph: 'doctor@hospital.com', type: 'email'    },
              { label: 'Password',    val: password, set: setPass,  ph: 'Min 8 characters',    type: 'password' },
            ].map(f => (
              <div key={f.label}>
                <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} className={iCls} required />
              </div>
            ))}
            <div>
              <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>Experience</label>
              <select value={experience} onChange={e => setExp(e.target.value)} className={iCls}>
                {EXPERIENCES.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>Consultation Fee ($)</label>
              <input type='number' value={fees} onChange={e => setFees(e.target.value)} placeholder='e.g. 50' className={iCls} required />
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>Speciality</label>
              <select value={speciality} onChange={e => setSpec(e.target.value)} className={iCls}>
                {SPECIALITIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>Education / Degree</label>
              <input value={degree} onChange={e => setDeg(e.target.value)} placeholder='e.g. MBBS, MD' className={iCls} required />
            </div>
            <div>
              <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>Address Line 1</label>
              <input value={addr1} onChange={e => setAddr1(e.target.value)} placeholder='Street address' className={iCls} required />
            </div>
            <div>
              <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>Address Line 2</label>
              <input value={addr2} onChange={e => setAddr2(e.target.value)} placeholder='City, State, ZIP' className={iCls} />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5'>About Doctor</label>
          <textarea value={about} onChange={e => setAbout(e.target.value)} rows={4} required
            placeholder="Brief description of the doctor's expertise..." className={`${iCls} resize-none`} />
        </div>

        <button type='submit' disabled={submitting}
          className='mt-6 bg-primary hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl transition-all flex items-center gap-2 disabled:opacity-60'>
          {submitting ? <><div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />Adding...</> : '➕ Add Doctor'}
        </button>
      </form>
    </div>
  )
}

export default AddDoctor
