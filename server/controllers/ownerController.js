// Api to change role to owner //
import fs from "fs";
import Car from "../models/Cars.js";
import Bookings from "../models/Bookings.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";

export const changeRoleToOwner = async (req, res) => {
    try {
        const { user } = req;

        if (user.role === "owner") {
            return res.json({ success: false, message: "User is already an owner" })
        }

        user.role = "owner"
        await user.save()
        res.json({ success: true, message: "Role changed to owner successfully" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


//Api to get all cars of an owner //

export const addCarsOfOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        const carData = JSON.parse(req.body.carData);
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Car image is required" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const uploadResult = await imagekit.files.upload({
            file: `data:${imageFile.mimetype};base64,${fileBuffer.toString("base64")}`,
            fileName: imageFile.originalname,
            folder: "/cars",
        });

        const newCar = await Car.create({
            ...carData,
            owner: _id,
            image: uploadResult.url,
        });

        fs.unlinkSync(imageFile.path);

        res.json({
            success: true,
            message: "Car added successfully",
            car: newCar,
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


// Api to List all cars of an owner //

export const getOwnersCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id });
        res.json({ success: true, cars })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Api to Toggle Availability of Car //
// NOTE: This only controls whether the car appears in public listings.
// It does NOT affect any existing bookings — those are managed separately.

export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.isAvailable = !car.isAvailable;
        await car.save();

        // Check if there are active confirmed bookings while being deactivated
        // We inform the admin but do NOT cancel those bookings automatically
        let activeBookingsWarning = null;
        if (!car.isAvailable) {
            const activeCount = await Bookings.countDocuments({
                car: carId,
                status: { $in: ["confirmed", "pending"] },
                returnDate: { $gt: new Date() }
            });
            if (activeCount > 0) {
                activeBookingsWarning = `Note: This car has ${activeCount} active booking(s) that will still be honoured.`;
            }
        }

        res.json({
            success: true,
            message: car.isAvailable ? "Car is now listed and visible to renters." : "Car has been hidden from public listings.",
            warning: activeBookingsWarning,
            car
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Api to Delete a Car //

export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.owner = null; // Remove reference to owner
        car.isAvailable = false; // Mark car as unavailable
        await car.remove();
        res.json({ success: true, message: "Car deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


//Api to get Dashboard Data of Owner //

export const getOwnerDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (role !== "owner") {
            return res.json({ success: false, message: "Unauthorized" });
        }
        const cars = await Car.find({ owner: _id });
        const totalCars = cars.length;
        const availableCars = cars.filter(car => car.isAvailable).length;
        const rentedCars = totalCars - availableCars;

        res.json({
            success: true,
            dashboardData: {
                totalCars,
                availableCars,
                rentedCars
            }
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// api to update user image //

export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const uploadResult = await imagekit.files.upload({
            file: `data:${imageFile.mimetype};base64,${fileBuffer.toString("base64")}`,
            fileName: imageFile.originalname,
            folder: "/users",
        });

        await User.findByIdAndUpdate(_id, { image: uploadResult.url }, { new: true });

        fs.unlinkSync(imageFile.path);

        res.json({
            success: true,
            message: "Profile picture updated successfully",
            imageUrl: uploadResult.url,
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}