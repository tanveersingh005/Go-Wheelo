import express from "express";
import {
    cancelBooking,
    checkAvailability,
    updateBookingStatus,
    createBooking,
    getCarBookings,
    getOwnerBookings,
    getUserBookings,
} from "../controllers/bookingController.js";
import protect from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailability);
bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.post("/cancel", protect, cancelBooking);
bookingRouter.post("/update-status", protect, updateBookingStatus);
bookingRouter.post("/car", getCarBookings);

export default bookingRouter;
