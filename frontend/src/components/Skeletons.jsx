import React from 'react'

export const DoctorCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card">
    <div className="skeleton h-48 w-full" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-3 w-1/3 rounded mt-3" />
    </div>
  </div>
)

export const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="skeleton h-32 w-32 rounded-2xl" />
    <div className="skeleton h-6 w-48 rounded" />
    <div className="skeleton h-4 w-64 rounded" />
    <div className="skeleton h-4 w-56 rounded" />
  </div>
)
