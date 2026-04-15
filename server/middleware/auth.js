import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" })
    }

    try {
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ success: false, message: "not authorized" })
        }
        const user = await User.findById(decoded.id).select("-password")
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" })
        }
        req.user = user
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token Error: " + error.message })
    }
    next()
}

export default protect;
