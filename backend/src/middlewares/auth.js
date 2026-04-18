import jwt from 'jsonwebtoken'

// ── Admin Auth ─────────────────────────────────────────────────────────────
export const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers
    if (!atoken) return res.json({ success: false, message: 'Not Authorized — no token' })

    const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET)
    if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: 'Not Authorized — invalid token' })
    }
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ── Doctor Auth ─────────────────────────────────────────────────────────────
export const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers
    if (!dtoken) return res.json({ success: false, message: 'Not Authorized — no token' })

    const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRET)
    req.docId = tokenDecode.id
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ── User Auth ───────────────────────────────────────────────────────────────
export const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) return res.json({ success: false, message: 'Not Authorized — no token' })

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = tokenDecode.id
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
