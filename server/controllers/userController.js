import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Cars from "../models/Cars.js";
import OTP from "../models/OTP.js";
import { sendOTPEmail } from "../utils/emailService.js";


// Generate JWT Token 

const generateToken = (userId) => {
    const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET)
}

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.json({ success: false, message: "Email required" });

        const userExists = await User.findOne({ email });
        if (userExists) return res.json({ success: false, message: "User already exists" });

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB (overwrites previous OTP for this email)
        await OTP.findOneAndUpdate({ email }, { otp, createdAt: Date.now() }, { upsert: true });

        const sent = await sendOTPEmail(email, otp);
        if (sent) {
            res.json({ success: true, message: "OTP sent to your email" });
        } else {
            res.json({ success: false, message: "Failed to send email" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender, otp } = req.body

        if (!name || !email || !password || !otp) {
            return res.json({ success: false, message: 'Fill all the fields including OTP' })
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.json({ success: false, message: 'Invalid or expired OTP' })
        }

        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.json({ success: false, message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        let autoImage = "";
        if (name) {
            const seed = encodeURIComponent(name);
            if (gender === "girl") {
                // DiceBear 'lorelei' - female-presenting, very reliable SVG avatar
                autoImage = `https://api.dicebear.com/8.x/lorelei/svg?seed=${seed}`;
            } else {
                // DiceBear 'adventurer' - male-presenting, very reliable SVG avatar
                autoImage = `https://api.dicebear.com/8.x/adventurer/svg?seed=${seed}`;
            }
        }

        const user = await User.create({ name, email, password: hashedPassword, image: autoImage })
        
        // Delete OTP after successful registration
        await OTP.deleteOne({ email });

        const token = generateToken(user._id.toString())
        res.json({ success: true, token })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "error message" })
    }
}


//Login User //

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({ success: true, token })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


// GET USER DATA  USING JWT TOKEN //

export const getUserData = async (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//  get all cars from the frontend //


export const getAllCars = async (req, res) => {
    try {
        const cars = await Cars.find({isAvailable: true});
        res.json({ success: true, message : "Cars retrieved successfully", cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}