// booking to check availability of car for a given date//  
import Bookings from "../models/Bookings.js";
import Cars from "../models/Cars.js";
import { createNotification } from "./notificationController.js";

// Auto-complete bookings that are STRICTLY past their return date
// Uses start-of-today so a booking due today is NEVER prematurely completed
const autoCompletePastBookings = async () => {
    try {
        // Cutoff = midnight at the start of TODAY (in server local time)
        // Only bookings whose returnDate < today (i.e., due yesterday or earlier) are completed
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const expiredBookings = await Bookings.find({
            returnDate: { $lt: startOfToday },
            status: { $in: ["confirmed"] }  // Only auto-complete confirmed ones; pending stays pending for admin to decide
        });

        for (const booking of expiredBookings) {
            booking.status = "completed";
            await booking.save();
            // We no longer track bookedUntil explicitly on the car; availability is computed live
        }
    } catch (e) {
        console.error("Auto complete error:", e);
    }
};

// Check if car has no conflicting CONFIRMED bookings for date range
const checkCarAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Bookings.find({
        car,
        status: { $in: ["confirmed"] }, // Only CONFIRMED bookings block a car now. Pending = under review.
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
    });

    return bookings.length === 0;
};


// api to check availability of car for given date and location//

export const checkAvailability = async (req, res) => {
    try {
        const { pickupDate, returnDate, location } = req.body;
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        if (!pickupDate || !returnDate || !location) {
            return res.json({ success: false, message: "pickupDate, returnDate and location are required" });
        }

        if (Number.isNaN(picked.getTime()) || Number.isNaN(returned.getTime())) {
            return res.json({ success: false, message: "Invalid pickup or return date" });
        }

        if (returned <= picked) {
            return res.json({ success: false, message: "Return date must be after pickup date" });
        }

        // Only show cars the admin has NOT hard-disabled (isAvailable: true)
        const cars = await Cars.find({ location, isAvailable: true });

        const availableCarsPromises = cars.map(async (car) => {
            const isAvailableForDates = await checkCarAvailability(car._id, picked, returned);
            return { ...car._doc, isAvailableForDates };
        });

        let availableCars = await Promise.all(availableCarsPromises);
        // Filter out cars that are confirmed-booked for those dates
        availableCars = availableCars.filter(car => car.isAvailableForDates === true);

        res.json({ success: true, availableCars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Api to create a booking — booking is always PENDING first, admin must confirm //

export const createBooking = async (req, res) => {
    try {
        const { carId, pickupDate, returnDate } = req.body;
        const { _id } = req.user;
        const car = await Cars.findById(carId);

        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        if (!car.isAvailable) {
            return res.json({ success: false, message: "This car has been removed from the fleet" });
        }

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        if (!carId || !pickupDate || !returnDate) {
            return res.json({ success: false, message: "carId, pickupDate and returnDate are required" });
        }

        if (Number.isNaN(picked.getTime()) || Number.isNaN(returned.getTime())) {
            return res.json({ success: false, message: "Invalid pickup or return date" });
        }

        if (returned <= picked) {
            return res.json({ success: false, message: "Return date must be after pickup date" });
        }

        const isAvailable = await checkCarAvailability(carId, picked, returned);
        if (!isAvailable) {
            return res.json({ success: false, message: "Car is already confirmed-booked for the selected dates" });
        }

        const timeDiff = returned - picked;
        const noOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const price = noOfDays * car.pricePerDay;

        // Status is always PENDING — admin must confirm before car is locked
        const booking = await Bookings.create({
            car: carId,
            user: _id,
            owner: car.owner,
            pickupDate,
            returnDate,
            price,
            paymentStatus: req.body.paymentStatus || "pending",
            paymentMethod: req.body.paymentMethod,
            transactionId: req.body.transactionId,
            currency: req.body.currency || "USD",
            status: "pending"
        });

        // Notify the OWNER that a new booking request arrived
        await createNotification({
            recipient: car.owner,
            sender:    _id,
            type:      "booking_requested",
            title:     "New Booking Request",
            message:   `A user has requested to book your ${car.brand} ${car.model}.`,
            bookingId: booking._id,
            carName:   `${car.brand} ${car.model}`,
        });

        res.json({ success: true, message: "Booking request submitted! Awaiting host confirmation.", booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Api to get all bookings of a user //
export const getUserBookings = async (req, res) => {
    try {
        await autoCompletePastBookings();
        const { _id } = req.user;
        const bookings = await Bookings.find({ user: _id }).populate("car");
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Api to get all bookings of an owner ///
export const getOwnerBookings = async (req, res) => {
    try {
        await autoCompletePastBookings();
        const { _id } = req.user;
        const bookings = await Bookings.find({ owner: _id }).populate("car").populate("user");
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Api to cancel a booking (by user) //
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const { _id } = req.user;
        const booking = await Bookings.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.user.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        booking.status = "cancelled";
        await booking.save();

        // Notify the OWNER that user cancelled
        const populatedCar = await Cars.findById(booking.car);
        await createNotification({
            recipient: booking.owner,
            sender:    _id,
            type:      "booking_cancelled",
            title:     "Booking Cancelled",
            message:   `A user cancelled their booking for ${populatedCar?.brand} ${populatedCar?.model}.`,
            bookingId: booking._id,
            carName:   populatedCar ? `${populatedCar.brand} ${populatedCar.model}` : "your car",
        });

        res.json({ success: true, message: "Booking cancelled successfully", booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Api to update booking status by owner (confirm / cancel / completed) //
// KEY LOGIC: Status changes only affect the booking. Car availability is calculated live dynamically.
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        const { _id } = req.user;
        const booking = await Bookings.findById(bookingId).populate("car");

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const allowedStatuses = ["confirmed", "cancelled", "completed", "pending"];
        if (!allowedStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        booking.status = status;
        await booking.save();

        // Notify the USER based on what the owner did
        const carName = booking.car?.brand
            ? `${booking.car.brand} ${booking.car.model}`
            : "your car";

        const notifMap = {
            confirmed: {
                type:    "booking_confirmed",
                title:   "Booking Confirmed! 🎉",
                message: `Your booking for ${carName} has been confirmed by the host.`,
            },
            cancelled: {
                type:    "booking_cancelled",
                title:   "Booking Cancelled",
                message: `Unfortunately your booking for ${carName} was cancelled by the host.`,
            },
            completed: {
                type:    "booking_completed",
                title:   "Booking Completed",
                message: `Your rental of ${carName} has been marked as returned. Thank you!`,
            },
        };

        if (notifMap[status]) {
            await createNotification({
                recipient: booking.user,
                sender:    _id,
                ...notifMap[status],
                bookingId: booking._id,
                carName,
            });
        }

        res.json({ success: true, message: `Booking ${status}`, booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Api to get all bookings of a car //
export const getCarBookings = async (req, res) => {
    try {
        const { carId } = req.body;
        const bookings = await Bookings.find({ car: carId }).populate("user").populate("owner");
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
