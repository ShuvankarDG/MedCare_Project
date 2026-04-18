import express from 'express'
import { chatWithBot, submitContact } from '../controllers/chatController.js'

const chatRouter = express.Router()

// POST /api/chat  — AI chatbot
chatRouter.post('/', chatWithBot)

// POST /api/contact/submit  — contact form
chatRouter.post('/contact/submit', submitContact)

export default chatRouter
