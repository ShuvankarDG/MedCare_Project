import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from '../components/DoctorCard'
import { DoctorCardSkeleton } from '../components/Skeletons'

const SPECIALITIES = [
  { name: 'General physician', icon: '🩺' },
  { name: 'Gynecologist', icon: '👩‍⚕️' },
  { name: 'Dermatologist', icon: '🧴' },
  { name: 'Pediatricians', icon: '👶' },
  { name: 'Neurologist', icon: '🧠' },
  { name: 'Gastroenterologist', icon: '🫀' },
]

const Doctors = () => {
  const { speciality } = useParams()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const navigate = useNavigate()
  const { doctors, loadingDoctors } = useContext(AppContext)
  const [filtered, setFiltered] = useState([])
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    let result = [...doctors]
    if (speciality) result = result.filter(d => d.speciality === speciality)
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase()
      result = result.filter(d => d.name.toLowerCase().includes(q) || d.speciality.toLowerCase().includes(q))
    }
    setFiltered(result)
  }, [doctors, speciality, localSearch])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-700 text-gray-900">Find a Doctor</h1>
        <p className="text-gray-500 mt-1">Browse through our network of trusted, verified specialists</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm focus-within:border-primary focus-within:shadow-card transition-all">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search doctors, specialities..."
            className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
          />
          {localSearch && (
            <button onClick={() => setLocalSearch('')} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
          )}
        </div>
        <button onClick={() => setShowFilter(!showFilter)}
          className={`sm:hidden flex items-center gap-1.5 px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${showFilter ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'}`}>
          ⚙️ Filter
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className={`${showFilter ? 'block' : 'hidden'} sm:block w-full sm:w-52 flex-shrink-0`}>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card sticky top-20">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Speciality</p>
            <div className="space-y-1">
              <button onClick={() => navigate('/doctors')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${!speciality ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                All Doctors
              </button>
              {SPECIALITIES.map(s => (
                <button key={s.name}
                  onClick={() => speciality === s.name ? navigate('/doctors') : navigate(`/doctors/${s.name}`)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${speciality === s.name ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <span>{s.icon}</span>{s.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loadingDoctors ? 'Loading...' : `${filtered.length} doctor${filtered.length !== 1 ? 's' : ''} found`}
              {speciality && <span className="ml-1 text-primary font-medium">in {speciality}</span>}
            </p>
            {(speciality || localSearch) && (
              <button onClick={() => { navigate('/doctors'); setLocalSearch('') }}
                className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1">
                ✕ Clear filters
              </button>
            )}
          </div>

          {loadingDoctors ? (
            <div className="grid grid-cols-auto gap-5">
              {Array(8).fill(0).map((_, i) => <DoctorCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-700 font-semibold">No doctors found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
              <button onClick={() => { navigate('/doctors'); setLocalSearch('') }}
                className="mt-4 text-primary font-medium text-sm hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-auto gap-5">
              {filtered.map(d => (
                <DoctorCard key={d._id} id={d._id} name={d.name} speciality={d.speciality} image={d.image} available={d.available} rating={d.rating} totalReviews={d.totalReviews} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors
