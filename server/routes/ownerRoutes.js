import express from "express";
import { addCarsOfOwner, changeRoleToOwner, getOwnersCars , toggleCarAvailability , deleteCar, updateUserImage } from "../controllers/ownerController.js";
import protect from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post('/change-role', protect, changeRoleToOwner)
ownerRouter.post('/add-car', protect, upload.single("image"), addCarsOfOwner)
ownerRouter.get('/cars', protect, getOwnersCars)
ownerRouter.post('/toggle-car-availability', protect, toggleCarAvailability)
ownerRouter.post('/delete-car', protect, deleteCar)
ownerRouter.post('/update-image' , protect , upload.single("image") , updateUserImage)

export default ownerRouter;
