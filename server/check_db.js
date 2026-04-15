import mongoose from 'mongoose';
import 'dotenv/config';

// define basic schema
const carSchema = new mongoose.Schema({}, { strict: false });
const Car = mongoose.model('cars', carSchema);

async function check() {
    try {
        await mongoose.connect(`${process.env.MONDOB_URI}/go-wheelo`);
        const allCars = await Car.find({});
        console.log("Total Cars:", allCars.length);
        console.log("All cars payload:", JSON.stringify(allCars, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}
check();
