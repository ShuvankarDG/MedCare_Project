import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'

// ─── Get all available doctors (public) ───────────────────────────────────
export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ available: true }).select('-password -email')
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Get doctor reviews (public) ──────────────────────────────────────────
export const getDoctorReviews = async (req, res) => {
  try {
    const { docId } = req.params
    const appointments = await appointmentModel.find({ docId, review: { $ne: null } })
    const reviews = appointments.map(a => ({ ...a.review, appointmentId: a._id }))
    res.json({ success: true, reviews })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Doctor Login ──────────────────────────────────────────────────────────
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })

    if (!doctor)
      return res.json({ success: false, message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch)
      return res.json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '7d'})
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Doctor Appointments ───────────────────────────────────────────────────
export const appointmentsDoctor = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.docId })
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Mark Complete ─────────────────────────────────────────────────────────
export const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appt = await appointmentModel.findById(appointmentId)

    if (appt && appt.docId === req.docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return res.json({ success: true, message: 'Appointment marked as completed' })
    }
    res.json({ success: false, message: 'Action failed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Cancel (by doctor) ────────────────────────────────────────────────────
export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appt = await appointmentModel.findById(appointmentId)

    if (appt && appt.docId === req.docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      return res.json({ success: true, message: 'Appointment cancelled' })
    }
    res.json({ success: false, message: 'Action failed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Doctor Dashboard ──────────────────────────────────────────────────────
export const doctorDashboard = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.docId })

    let earnings = 0
    const patientSet = new Set()
    appointments.forEach(a => {
      if (a.isCompleted || a.payment) earnings += a.amount
      patientSet.add(a.userId)
    })

    res.json({
      success: true,
      dashData: {
        earnings,
        appointments: appointments.length,
        patients: patientSet.size,
        latestAppointments: [...appointments].reverse().slice(0, 5),
      },
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Get Doctor Profile ────────────────────────────────────────────────────
export const doctorProfile = async (req, res) => {
  try {
    const profileData = await doctorModel.findById(req.docId).select('-password')
    res.json({ success: true, profileData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Update Doctor Profile ─────────────────────────────────────────────────
export const updateDoctorProfile = async (req, res) => {
  try {
    const { fees, address, available } = req.body
    await doctorModel.findByIdAndUpdate(req.docId, { fees, address, available })
    res.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
