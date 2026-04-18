import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from '../components/DoctorCard'
import { DoctorCardSkeleton } from '../components/Skeletons'

const SPECIALITIES = [
  { name: 'General physician', icon: '🩺', color: 'from-blue-50 to-blue-100', text: 'text-blue-600' },
  { name: 'Gynecologist', icon: '👩‍⚕️', color: 'from-pink-50 to-pink-100', text: 'text-pink-600' },
  { name: 'Dermatologist', icon: '🧴', color: 'from-orange-50 to-orange-100', text: 'text-orange-600' },
  { name: 'Pediatricians', icon: '👶', color: 'from-yellow-50 to-yellow-100', text: 'text-yellow-600' },
  { name: 'Neurologist', icon: '🧠', color: 'from-purple-50 to-purple-100', text: 'text-purple-600' },
  { name: 'Gastroenterologist', icon: '🫀', color: 'from-red-50 to-red-100', text: 'text-red-600' },
]

const STATS = [
  { value: '500+', label: 'Expert Doctors' },
  { value: '50k+', label: 'Happy Patients' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Support' },
]

const Home = () => {
  const navigate = useNavigate()
  const { doctors, loadingDoctors } = useContext(AppContext)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`)
    else navigate('/doctors')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl my-6 bg-gradient-to-br from-primary via-blue-600 to-accent p-8 sm:p-14 min-h-[420px] flex flex-col justify-center">
        {/* BG decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-accent/20 rounded-full translate-y-1/2 blur-xl" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-float" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fadeUp">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Trusted by 50,000+ patients
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-800 text-white leading-tight animate-fadeUp delay-100">
            Book Appointments<br />
            <span className="text-white/80">With Trusted Doctors</span>
          </h1>
          <p className="text-blue-100 mt-4 text-base leading-relaxed max-w-md animate-fadeUp delay-200">
            Connect with verified specialists in minutes. Schedule appointments, manage your health — all in one place.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 animate-fadeUp delay-300">
            <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name or speciality..."
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
              />
            </div>
            <button type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex-shrink-0">
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-6 mt-8 animate-fadeUp delay-400">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-display font-800 text-white">{s.value}</p>
                <p className="text-blue-200 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialities ── */}
      <section className="py-14" id="speciality">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-700 text-gray-900">Browse by Speciality</h2>
            <p className="text-gray-500 text-sm mt-1">Find the right specialist for your needs</p>
          </div>
          <button onClick={() => navigate('/doctors')} className="text-primary text-sm font-semibold hover:underline hidden sm:block">
            View all →
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {SPECIALITIES.map((s, i) => (
            <div key={s.name}
              onClick={() => { navigate(`/doctors/${s.name}`); scrollTo(0,0) }}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`card-lift cursor-pointer bg-gradient-to-br ${s.color} rounded-2xl p-4 text-center border border-white shadow-sm`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className={`text-xs font-semibold ${s.text} leading-tight`}>{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top Doctors ── */}
      <section className="py-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-700 text-gray-900">Top Rated Doctors</h2>
            <p className="text-gray-500 text-sm mt-1">Verified specialists ready to help you</p>
          </div>
          <button onClick={() => { navigate('/doctors'); scrollTo(0,0) }}
            className="text-primary text-sm font-semibold hover:underline hidden sm:block">
            See all →
          </button>
        </div>

        <div className="grid grid-cols-auto gap-5">
          {loadingDoctors
            ? Array(8).fill(0).map((_, i) => <DoctorCardSkeleton key={i} />)
            : doctors.slice(0, 8).map(d => (
                <DoctorCard key={d._id} id={d._id} name={d.name} speciality={d.speciality} image={d.image} available={d.available} rating={d.rating} totalReviews={d.totalReviews} />
              ))
          }
        </div>

        <div className="text-center mt-10">
          <button onClick={() => { navigate('/doctors'); scrollTo(0,0) }}
            className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300">
            Browse All Doctors →
          </button>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-display font-700 text-gray-900">How It Works</h2>
          <p className="text-gray-500 text-sm mt-2">Get a doctor's appointment in 3 easy steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', icon: '🔍', title: 'Find a Doctor', desc: 'Search by speciality or browse our extensive list of verified doctors.' },
            { step: '02', icon: '📅', title: 'Book a Slot', desc: 'Choose a convenient date and time from the doctor\'s available schedule.' },
            { step: '03', icon: '✅', title: 'Get Confirmed', desc: 'Receive instant confirmation and reminders for your appointment.' },
          ].map((item, i) => (
            <div key={i} className="relative bg-white rounded-3xl p-7 shadow-card border border-gray-100 group hover:border-primary/30 transition-all duration-300">
              <span className="text-6xl font-display font-800 text-gray-50 absolute top-4 right-5 select-none group-hover:text-primary/10 transition-colors">{item.step}</span>
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-display font-700 text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="my-6 mb-16">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 px-8 sm:px-14 py-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-white/60 text-sm font-medium mb-2 uppercase tracking-widest">Start Today</p>
            <h2 className="text-3xl sm:text-4xl font-display font-800 text-white leading-tight">
              Your health is our<br /><span className="gradient-text">top priority</span>
            </h2>
            <p className="text-gray-400 mt-3 text-sm max-w-xs">Join thousands of patients who've made managing their healthcare effortless.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button onClick={() => { navigate('/login'); scrollTo(0,0) }}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 shadow-glow">
              Create Free Account
            </button>
            <button onClick={() => { navigate('/doctors'); scrollTo(0,0) }}
              className="border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200">
              Browse Doctors
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
