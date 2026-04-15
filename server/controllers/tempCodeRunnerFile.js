// booking to check availability of car for a given date//  
import Bookings from "../models/Bookings.js";
import Cars from "../models/Cars.js";

const checkCarAvailability = async (car , pickupDate, returnDate) => {
    const bookings = await Bookings.find({ car , pickupDate: { $lte: returnDate }, returnDate: { $gte: pickupDate } });

    return bookings.length === 0; // Car is available if there are no overlapping bookings 

    for (let booking of bookings) {
        if (
            (pickupDate >= booking.pickupDate && pickupDate <= booking.returnDate) ||
            (returnDate >= booking.pickupDate && returnDate <= booking.returnDate) ||
            (pickupDate <= booking.pickupDate && returnDate >= booking.returnDate)
        ) {
            return false; // Car is not available
        }
    }
}


// api to check availability of car for given date and location//

export const checkAvailability = async (req, res) => {

    try {
        const { pickupDate, returnDate, location } = req.body;
        const cars = await Cars.find({ location , isAvailable:true });
        const availableCarsPromises = cars.map(async (car) =>{
            const isAvailable = await checkCarAvailability(car._id, pickupDate, returnDate);
            return {...car._doc, isAvailable : isAvailable};
        })
        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true);
        res.json({ success: true, availableCars });
    }   catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Api to create a booking //

export const createBooking = async (req, res) => {
    try {
        const { carId, pickupDate, returnDate } = req.body;
        const { _id } = req.user;
        const car = await Cars.findById(carId);
        const isAvailable = await checkCarAvailability(carId, pickupDate, returnDate);
        if(!isAvailable) {
            return res.json({ success: false, message: "Car is not available for the selected dates" });
        }

        const carData = await Cars.findById(carId);

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        const noOfDays  = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const price = noOfDays * carData.pricePerDay;


        const booking = await Bookings.create({
            car: carId,
            user: _id,
            owner: car.owner,
            pickupDate,
            returnDate,
            price
        });
        res.json({ success: true, message: "Booking created successfully", booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Api to get all bookings of a user //

export const getUserBookings = async (req, res) => {            
    try {
        const { _id } = req.user;
        const bookings = await Bookings.find({ user: _id }).populate("car");
        res.json({ success: true, bookings });
    }
        catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Api to get all bookings of a owner ///
export const getOwnerBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Bookings.find({ owner: _id }).populate("car").populate("user");
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Api to cancel a booking //
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const { _id } = req.user;
        const booking = await Bookings.findById(bookingId);
        if(booking.user.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        booking.status = "cancelled";
        await booking.save();
        res.json({ success: true, message: "Booking cancelled successfully", booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Api to confirm a booking by owner //
export const confirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const { _id } = req.user;
        const booking = await Bookings.findById(bookingId);
        if(booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        booking.status = "confirmed";
        await booking.save();
        res.json({ success: true, message: "Booking confirmed successfully", booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Api to get all bookings of a car //
export const getCarBookings = async (req, res) => {
    try {
        const { carId } = req.body;
        const bookings = await Bookings.find({ car: carId }).populate("user").populate("owner");
        res.json({ success: true, bookings });
    }
        catch (error) { 
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}




