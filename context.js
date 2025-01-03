// context.js
const { Pinecone } = require('@pinecone-database/pinecone');
const { HfInference } = require("@huggingface/inference") ;

// Initialize Pinecone and Hugging Face Client
const pc = new Pinecone({
  apiKey: 'pcsk_6BjUY6_373kiBuBbcUt4B4yofrqCW9xZxFxxMpiQ1uJ53TEfSdn6LPNoPdsyw3XZiP34Yt'
});
const index = pc.index('index'); // Your Pinecone index name

const client = new HfInference("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");

// Function to generate embeddings using Hugging Face API
async function generateEmbedding(text) {
  try {
    const response = await client.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L12-v2", // 1536-dimensional embedding model
        inputs: text,
      });
      
    return response; // Returns a 1D array of embeddings
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

// Function to store user context in Pinecone
async function storeUserContext(userId, userContext) {
  const embedding = await generateEmbedding(userContext);

  if (!embedding) {
    throw new Error("Failed to generate embedding for the context.");
  }

  const contextData = {
    id: `user-context-${userId}`, // Unique ID for the user’s context
    values: embedding, // Store the embedding vector
    metadata: {
      user_id: userId, // Attach user ID to the context
      context: userContext, // Store the context as metadata
    },
  };

  await index.upsert([contextData]);
  console.log(`Context for user ${userId} stored successfully in Pinecone.`);
}

// Function to fetch user context from Pinecone
async function fetchContextFromPinecone(userId) {
    try {
      console.log(`Fetching context for user: ${userId}`);
  
      // Define a dummy vector with the same dimension as your index
      const dummyVector = Array(384).fill(0);
  
      const response = await index.query({
        vector: dummyVector,
        filter: { user_id: userId },
        topK: 100,
        includeMetadata: true,
      });
  
      if (response.matches && response.matches.length > 0) {
        return response.matches[0].metadata.context; // Return the context if found
      } else {
        return ""; // Return empty string if no context is found
      }
    } catch (error) {
      console.error("Error fetching context from Pinecone:", error);
      return ""; // Return empty string in case of error
    }
  }

module.exports= { storeUserContext, fetchContextFromPinecone };
