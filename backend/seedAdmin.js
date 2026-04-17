import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import User from './models/User.js';

// Global DNS override to fix connection issues if local DNS fails
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected for seeding...");

        const adminEmail = 'cimage@gmail.com';
        const adminPassword = 'Cimage123';

        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log("Admin user already exists. Updating password/role...");
            userExists.password = adminPassword; // User model handles hashing via pre-save hook
            userExists.role = 'admin';
            userExists.name = 'CIMAGE ADMIN HQ';
            await userExists.save();
            console.log("Admin user updated successfully.");
        } else {
            console.log("Creating new Admin user...");
            await User.create({
                name: 'CIMAGE ADMIN HQ',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                department: 'ADMINISTRATION'
            });
            console.log("Admin user created successfully.");
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err.message);
        process.exit(1);
    }
};

seedAdmin();
