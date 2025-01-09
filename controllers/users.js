const asyncHandler = require("express-async-handler");
const User = require("../models/users");

const users = asyncHandler(async (req, res) => {
    const { userId, name, email } = req.body;

    if (!userId || !name || !email) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
        return res.status(200).json({
            success: true,
            message: "User with this email already exists.",
            user: existingUser
        });
    } else {
        const user = await User.create(req.body);
        if (user) {
            return res.status(200).json({
                success: true,
                message: "User created successfully",
                user
            });
        } else return res.status(500).json({ message: "Failed to create user." });
    }
});

const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ userId: id });
        if (!user) return res.status(404).json({ message: "User not found" });
        else return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
});


module.exports = { users, getSingleUser };