const express = require('express');
const cors =require('cors')
const bodyParser = require('body-parser');
const { storeUserContext, fetchContextFromPinecone } = require('./context.js');
const { generateResponse } = require('./ai.js');
const morgan = require("morgan")

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))
app.use(cors("*"))
app.use(morgan('dev'))
// Endpoint to store user context
app.post('/store-context', async (req, res) => {
  const { userId, userContext } = req.body;

  try {
    await storeUserContext(userId, userContext);
    res.status(200).json({ message: `Context for user ${userId} stored successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Error storing user context', details: error.message });
  }
});

// Endpoint to handle user query
app.post('/handle-query', async (req, res) => {
  const { userId, userQuery } = req.body;
  try {
    const response = await generateResponse(userId, userQuery);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Error generating response', details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3049;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
