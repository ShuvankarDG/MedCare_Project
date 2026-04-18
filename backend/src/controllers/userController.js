import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import Stripe from 'stripe'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

// ─── Register ──────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password)
      return res.json({ success: false, message: 'Missing details' })
    if (!validator.isEmail(email))
      return res.json({ success: false, message: 'Enter a valid email' })
    if (password.length < 8)
      return res.json({ success: false, message: 'Password must be at least 8 characters' })

    const existing = await userModel.findOne({ email })
    if (existing)
      return res.json({ success: false, message: 'Email already registered' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await new userModel({ name, email, password: hashedPassword }).save()

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Login ─────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user)
      return res.json({ success: false, message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Get Profile ───────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Update Profile ────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender)
      return res.json({ success: false, message: 'Missing required fields' })

    await userModel.findByIdAndUpdate(req.userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    })

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      await userModel.findByIdAndUpdate(req.userId, { image: imageUpload.secure_url })
    }

    res.json({ success: true, message: 'Profile updated successfully' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Book Appointment ──────────────────────────────────────────────────────
export const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body

    const docData = await doctorModel.findById(docId).select('-password')
    if (!docData)
      return res.json({ success: false, message: 'Doctor not found' })
    if (!docData.available)
      return res.json({ success: false, message: 'Doctor is not available' })

    let slots_booked = docData.slots_booked
    if (slots_booked[slotDate]?.includes(slotTime))
      return res.json({ success: false, message: 'Slot already booked' })

    slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime]

    const userData = await userModel.findById(req.userId).select('-password')
    const docDataClean = docData.toObject()
    delete docDataClean.slots_booked

    const appointment = new appointmentModel({
      userId: req.userId,
      docId,
      userData,
      docData: docDataClean,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    })

    await appointment.save()
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment booked successfully' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── List Appointments ─────────────────────────────────────────────────────
export const listAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.userId })
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Cancel Appointment ────────────────────────────────────────────────────
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appt = await appointmentModel.findById(appointmentId)

    if (!appt)
      return res.json({ success: false, message: 'Appointment not found' })
    if (appt.userId !== req.userId)
      return res.json({ success: false, message: 'Unauthorized action' })

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // Free the slot on doctor's calendar
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

// ─── Stripe Payment ────────────────────────────────────────────────────────
export const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body
    

    const appt = await appointmentModel.findById(appointmentId)
    if (!appt || appt.cancelled)
      return res.json({ success: false, message: 'Appointment cancelled or not found' })

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&appointmentId=${appt._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&appointmentId=${appt._id}`,
      line_items: [{
        price_data: {
          currency: 'bdt',        
          product_data: {
            name: `Appointment with Dr. ${appt.docData.name}`,
            description: `${appt.slotDate} at ${appt.slotTime}`,
          },
          unit_amount: appt.amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
    })

    res.json({ success: true, session_url: session.url })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Verify Stripe ─────────────────────────────────────────────────────────
export const verifyStripe = async (req, res) => {
  try {
    const { appointmentId, success } = req.body
    if (success === 'true') {
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
      return res.json({ success: true, message: 'Payment confirmed' })
    }
    res.json({ success: false, message: 'Payment was not completed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ─── Add Review (NEW) ──────────────────────────────────────────────────────
// POST /api/user/add-review  { appointmentId, rating, comment }
export const addReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body

    if (!rating || rating < 1 || rating > 5)
      return res.json({ success: false, message: 'Rating must be between 1 and 5' })

    const appt = await appointmentModel.findById(appointmentId)
    if (!appt)
      return res.json({ success: false, message: 'Appointment not found' })
    if (appt.userId !== req.userId)
      return res.json({ success: false, message: 'Unauthorized' })
    if (!appt.isCompleted)
      return res.json({ success: false, message: 'Can only review completed appointments' })
    if (appt.review)
      return res.json({ success: false, message: 'Review already submitted' })

    const review = {
      rating: Number(rating),
      comment: comment || '',
      userName: appt.userData.name,
      userImage: appt.userData.image,
      createdAt: new Date(),
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { review })

    // Update doctor's aggregate rating
    const doctor = await doctorModel.findById(appt.docId)
    const newTotal = doctor.totalReviews + 1
    const newRating = ((doctor.rating * doctor.totalReviews) + Number(rating)) / newTotal
    await doctorModel.findByIdAndUpdate(appt.docId, {
      rating: Math.round(newRating * 10) / 10,
      totalReviews: newTotal,
    })

    res.json({ success: true, message: 'Review added successfully' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
