const asyncHandler = require("express-async-handler");
const User = require("../models/users");

const users = asyncHandler(async (req, res) => {
    const { userId, name, email } = req.body;

    if (!userId || !name || !email) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.create(req.body);

    if (user) {
        return res.status(201).json({
            message: "User created successfully",
            user,
        });
    } else return res.status(500).json({ message: "Failed to create user." });
});

const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.query;

    const user = await User.findOne({ userId: _id });

    if (!user) res.status(404).json({ message: "User not found" });

    if (user) res.status(200).json({ user })
    else res.status(500).json("An unexpected error occured")
});


module.exports = { users, getSingleUser };