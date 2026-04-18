import React from 'react'
import { useNavigate } from 'react-router-dom'

const StarRating = ({ rating = 0, totalReviews = 0 }) => {
  const filled = Math.round(rating)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3 h-3 ${s <= filled ? 'text-amber-400' : 'text-gray-200'} fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {totalReviews > 0 && (
        <span className="text-xs text-gray-400 ml-1">({totalReviews})</span>
      )}
    </div>
  )
}

const DoctorCard = ({ id, name, speciality, image, available, rating = 0, totalReviews = 0 }) => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => { navigate(`/appointment/${id}`); scrollTo(0, 0) }}
      className="card-lift bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 shadow-card group"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-light to-blue-50 h-48">
        <img src={image} alt={name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${available ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {available ? 'Available' : 'Unavailable'}
        </div>
      </div>
      <div className="p-4">
        <p className="font-display font-700 text-gray-900 text-base leading-tight">{name}</p>
        <p className="text-primary text-sm font-medium mt-0.5">{speciality}</p>
        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={rating} totalReviews={totalReviews} />
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">Book →</span>
        </div>
      </div>
    </div>
  )
}

export default DoctorCard
