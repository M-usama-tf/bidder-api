const express = require("express");
const { users, getSingleUser } = require("../controllers/users");
const router = express.Router();

router.post("/user", users);
router.get("/user", getSingleUser);

module.exports = router;