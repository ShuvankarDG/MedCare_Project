import express from 'express'
import {
  doctorList,
  getDoctorReviews,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
} from '../controllers/doctorController.js'
import { authDoctor } from '../middlewares/auth.js'

const doctorRouter = express.Router()

// Public
doctorRouter.get('/list',                   doctorList)
doctorRouter.get('/:docId/reviews',         getDoctorReviews)
doctorRouter.post('/login',                 loginDoctor)

// Protected (doctor only)
doctorRouter.get('/appointments',           authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment',  authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment',    authDoctor, appointmentCancel)
doctorRouter.get('/dashboard',              authDoctor, doctorDashboard)
doctorRouter.get('/profile',               authDoctor, doctorProfile)
doctorRouter.post('/update-profile',        authDoctor, updateDoctorProfile)

export default doctorRouter
