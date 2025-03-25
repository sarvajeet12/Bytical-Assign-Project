const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Failed to connect to Database', err);
        process.exit(1);
    }
};

module.exports = connectDB;