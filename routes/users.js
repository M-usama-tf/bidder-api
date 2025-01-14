const express = require("express");
const { users, getSingleUser, getUsesJobLimit } = require("../controllers/users");
const router = express.Router();

router.post("/user", users);
router.get("/user/:id", getSingleUser);
router.get("/job/user/:id", getUsesJobLimit);

module.exports = router;