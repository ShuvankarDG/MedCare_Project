import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const EditDoctor = () => {
  const { docId } = useParams()
  const { aToken, backendUrl, getAllDoctors } = useContext(AdminContext)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [docImg, setDocImg] = useState(null)
  const [previewImg, setPreviewImg] = useState(null)

  const [name, setName] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [degree, setDegree] = useState('')
  const [experience, setExperience] = useState('')
  const [about, setAbout] = useState('')
  const [fees, setFees] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
          headers: { atoken: aToken },
        })
        if (data.success) {
          const doc = data.doctors.find(d => d._id === docId)
          if (!doc) { toast.error('Doctor not found'); navigate('/admin/doctors'); return }
          setName(doc.name)
          setSpeciality(doc.speciality)
          setDegree(doc.degree)
          setExperience(doc.experience)
          setAbout(doc.about)
          setFees(doc.fees)
          setAddress1(doc.address?.line1 || '')
          setAddress2(doc.address?.line2 || '')
          setAvailable(doc.available)
          setPreviewImg(doc.image)
        }
      } catch (e) {
        toast.error('Failed to load doctor')
      } finally {
        setLoading(false)
      }
    }
    if (aToken) fetchDoctor()
  }, [aToken, docId])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setDocImg(file)
      setPreviewImg(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('docId', docId)
      formData.append('name', name)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('experience', experience)
      formData.append('about', about)
      formData.append('fees', fees)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
      formData.append('available', available)
      if (docImg) formData.append('image', docImg)

      const { data } = await axios.post(`${backendUrl}/api/admin/edit-doctor`, formData, {
        headers: { atoken: aToken },
      })

      if (data.success) {
        toast.success('Doctor updated successfully!')
        getAllDoctors()
        navigate('/admin/doctors')
      } else {
        toast.error(data.message)
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div className='max-w-3xl'>
      <div className='flex items-center gap-3 mb-6'>
        <button onClick={() => navigate('/admin/doctors')}
          className='text-gray-400 hover:text-gray-600 transition-colors'>
          ← Back
        </button>
        <h1 className='text-xl font-semibold text-gray-700'>Edit Doctor</h1>
      </div>

      <form onSubmit={handleSubmit} className='bg-white rounded-xl border p-6 space-y-5'>

        {/* Photo */}
        <div className='flex items-center gap-5'>
          <label htmlFor='doc-img' className='cursor-pointer'>
            <img
              src={previewImg || 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg'}
              alt='Doctor'
              className='w-20 h-20 rounded-full object-cover border-2 border-primary/30 hover:opacity-80 transition-opacity'
            />
          </label>
          <input id='doc-img' type='file' accept='image/*' hidden onChange={handleImageChange} />
          <div>
            <p className='font-medium text-gray-700'>Doctor Photo</p>
            <p className='text-sm text-gray-400'>Click photo to change</p>
          </div>
        </div>

        {/* Name & Speciality */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>Speciality</label>
            <select value={speciality} onChange={e => setSpeciality(e.target.value)} required
              className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30'>
              <option value='General physician'>General physician</option>
              <option value='Gynecologist'>Gynecologist</option>
              <option value='Dermatologist'>Dermatologist</option>
              <option value='Pediatricians'>Pediatricians</option>
              <option value='Neurologist'>Neurologist</option>
              <option value='Gastroenterologist'>Gastroenterologist</option>
            </select>
          </div>
        </div>

        {/* Degree & Experience */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>Degree</label>
            <input value={degree} onChange={e => setDegree(e.target.value)} required
              className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>Experience</label>
            <select value={experience} onChange={e => setExperience(e.target.value)} required
              className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30'>
              {[1,2,3,4,5,6,7,8,9,10].map(y => (
                <option key={y} value={`${y} Year`}>{y} Year</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fees */}
        <div>
          <label className='text-sm font-medium text-gray-600 mb-1 block'>Consultation Fees (BDT)</label>
          <input type='number' value={fees} onChange={e => setFees(e.target.value)} required min='0'
            className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
        </div>

        {/* Address */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>Address Line 1</label>
            <input value={address1} onChange={e => setAddress1(e.target.value)}
              className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>Address Line 2</label>
            <input value={address2} onChange={e => setAddress2(e.target.value)}
              className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
          </div>
        </div>

        {/* About */}
        <div>
          <label className='text-sm font-medium text-gray-600 mb-1 block'>About</label>
          <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3} required
            className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none' />
        </div>

        {/* Available */}
        <div className='flex items-center gap-2'>
          <input type='checkbox' id='available' checked={available} onChange={e => setAvailable(e.target.checked)}
            className='w-4 h-4 accent-primary cursor-pointer' />
          <label htmlFor='available' className='text-sm font-medium text-gray-600 cursor-pointer'>Available for appointments</label>
        </div>

        {/* Buttons */}
        <div className='flex gap-3 pt-2'>
          <button type='submit' disabled={saving}
            className='bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type='button' onClick={() => navigate('/admin/doctors')}
            className='border px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors'>
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}

export default EditDoctor
