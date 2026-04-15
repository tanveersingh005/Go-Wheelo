import express from "express";
import { registerUser , loginUser , getUserData , getAllCars, sendOTP } from "../controllers/userController.js";
import protect from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/send-otp' , sendOTP)
userRouter.post('/register' , registerUser)
userRouter.post('/login' , loginUser)
userRouter.get('/data' , protect , getUserData) 
userRouter.get('/cars' , getAllCars) 

export default userRouter;