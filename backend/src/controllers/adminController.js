import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import contactModel from '../models/contactModel.js'

// ─── Admin Login ───────────────────────────────────────────────────────────
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      return res.json({ success: true, token })
    }
    res.json({ success: false, message: 'Invalid credentials' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Add Doctor ────────────────────────────────────────────────────────────
export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
      return res.json({ success: false, message: 'All fields are required' })
    if (!validator.isEmail(email))
      return res.json({ success: false, message: 'Enter a valid email' })
    if (password.length < 8)
      return res.json({ success: false, message: 'Password must be at least 8 characters' })

    const existing = await doctorModel.findOne({ email })
    if (existing)
      return res.json({ success: false, message: 'Doctor with this email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    let imageUrl = 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg'
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      imageUrl = upload.secure_url
    }

    const newDoctor = new doctorModel({
      name, email,
      image: imageUrl,
      password: hashedPassword,
      speciality, degree, experience, about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    })
    await newDoctor.save()

    res.json({ success: true, message: 'Doctor added successfully' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── All Doctors ───────────────────────────────────────────────────────────
export const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Toggle Availability ───────────────────────────────────────────────────
export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body
    const doctor = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !doctor.available })
    res.json({ success: true, message: 'Availability updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── All Appointments ──────────────────────────────────────────────────────
export const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Cancel Appointment (admin) ────────────────────────────────────────────
export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appt = await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true }, { new: false })

    // Release doctor slot
    const doctorData = await doctorModel.findById(appt.docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[appt.slotDate] = (slots_booked[appt.slotDate] || []).filter(t => t !== appt.slotTime)
    await doctorModel.findByIdAndUpdate(appt.docId, { slots_booked })

    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────
export const adminDashboard = async (req, res) => {
  try {
    const [doctors, users, appointments] = await Promise.all([
      doctorModel.find({}),
      userModel.find({}),
      appointmentModel.find({}),
    ])

    const revenue = appointments
      .filter(a => a.payment || a.isCompleted)
      .reduce((sum, a) => sum + a.amount, 0)

    res.json({
      success: true,
      dashData: {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        revenue,
        latestAppointments: [...appointments].reverse().slice(0, 5),
      },
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Delete Doctor (NEW) ───────────────────────────────────────────────────
export const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body
    await doctorModel.findByIdAndDelete(docId)
    res.json({ success: true, message: 'Doctor removed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Get Contact Messages (NEW) ────────────────────────────────────────────
export const getContactMessages = async (req, res) => {
  try {
    const messages = await contactModel.find({}).sort({ createdAt: -1 })
    res.json({ success: true, messages })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Mark Contact Message as Read (NEW) ───────────────────────────────────
export const markContactRead = async (req, res) => {
  try {
    const { messageId } = req.body
    await contactModel.findByIdAndUpdate(messageId, { read: true })
    res.json({ success: true, message: 'Marked as read' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
