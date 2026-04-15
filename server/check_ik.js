import mongoose from 'mongoose';
import 'dotenv/config';

async function fixDB() {
    try {
        await mongoose.connect(`${process.env.MONDOB_URI}/go-wheelo`);
        console.log("Connected to DB.");
        const db = mongoose.connection.db;
        const result = await db.collection('cars').dropIndex('licensePlate_1');
        console.log("Dropped outdated licensePlate_1 index:", result);
    } catch (e) {
        console.error("Error dropping index:", e);
    } finally {
        mongoose.disconnect();
    }
}

fixDB();
