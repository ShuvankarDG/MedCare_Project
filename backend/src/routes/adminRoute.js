import express from 'express'
import {
  loginAdmin,
  addDoctor,
  editDoctor,
  allDoctors,
  changeAvailability,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  deleteDoctor,
  getContactMessages,
  markContactRead,
} from '../controllers/adminController.js'
import { authAdmin } from '../middlewares/auth.js'
import upload from '../middlewares/multer.js'

const adminRouter = express.Router()

adminRouter.post('/login',              loginAdmin)

adminRouter.post('/add-doctor',         authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/edit-doctor',        authAdmin, upload.single('image'), editDoctor)
adminRouter.get('/all-doctors',         authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.post('/delete-doctor',      authAdmin, deleteDoctor)

adminRouter.get('/appointments',        authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard',           authAdmin, adminDashboard)

// NEW — contact messages inbox
adminRouter.get('/contact-messages',    authAdmin, getContactMessages)
adminRouter.post('/mark-contact-read',  authAdmin, markContactRead)

export default adminRouter
