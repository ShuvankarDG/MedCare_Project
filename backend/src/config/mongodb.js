import mongoose from 'mongoose'

const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'))
  mongoose.connection.on('error', (err) => console.error('❌ MongoDB error:', err))
  await mongoose.connect(`${process.env.MONGODB_URI}`)
}

export default connectDB
