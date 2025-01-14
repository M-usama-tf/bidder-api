const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3049;
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const morgan = require("morgan")
const { generateResponse } = require('./ai.js');
const { storeUserContext } = require('./context.js');
const User = require("./models/users.js");
const UserJob = require("./models/userJob.js")

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: "*" }))
app.use(morgan('dev'))

app.use("/api", require("./routes/users.js"));

app.post('/store-context', async (req, res) => {
  const { userId, userContext } = req.body;

  try {
    await storeUserContext(userId, userContext);

    const user = await User.findOne({ userId });

    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        { userId },
        { context: true },
        { new: true }
      );
      return res.status(200).json({ message: "Context added successfully.", user: updatedUser });
    } else {
      return res.status(400).json({ message: "User not found. Please add a user first." });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error storing user context",
      details: error.message,
    });
  }
});

app.post('/handle-query', async (req, res) => {
  const { userQuery, userId } = req.body;
  const { title, description, jobLinks } = userQuery;

  try {
    if (!userId || !userQuery) return res.status(400).json({ error: "userId and userQuery are required." });

    const user = await User.findOne({ userId });
    
    if (!user) return res.status(404).json({ error: "User not found." });

    if (user.limit <= 0) {
      return res.status(403).json({ 
        error: "Query limit reached", 
        message: "You have reached your maximum number of queries. Please upgrade to continue." 
      });
    };

    const response = await generateResponse(userId, userQuery);

    await UserJob.create({
      userId,
      title,
      jobLinks,
      description
    });

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $inc: { limit: -1 } },
      { new: true }
    );

    res.status(200).json({ response, updatedLimit: updatedUser.limit });
  } catch (error) {
    res.status(500).json({ error: "Error generating response", details: error.message });
  }
});


connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
