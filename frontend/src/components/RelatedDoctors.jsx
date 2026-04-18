import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import DoctorCard from './DoctorCard'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      setRelated(doctors.filter(d => d.speciality === speciality && d._id !== docId).slice(0, 4))
    }
  }, [doctors, speciality, docId])

  if (!related.length) return null

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-display font-700 text-gray-900">Related Doctors</h2>
        <p className="text-gray-500 mt-2 text-sm">Other specialists you might like</p>
      </div>
      <div className="grid grid-cols-auto gap-5">
        {related.map(d => (
          <DoctorCard key={d._id} id={d._id} name={d.name} speciality={d.speciality} image={d.image} available={d.available} rating={d.rating} totalReviews={d.totalReviews} />
        ))}
      </div>
    </section>
  )
}

export default RelatedDoctors
