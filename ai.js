// ai.js
const  { HfInference } = require("@huggingface/inference") ;
const { fetchContextFromPinecone } =  require('./context') // Import context functions

// Initialize Hugging Face Inference Client
const client = new HfInference("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");

// Function to generate response using the Llama model and user context
async function generateResponse(userId, userQuery) {
  // Fetch the stored context from Pinecone for the user
  const context = await fetchContextFromPinecone(userId);
      
  // Enhance the user query with the retrieved context
  const enhancedPrompt =`Context: ${context} Using the job description provided, craft a highly professional, concise, and tailored Upwork proposal that aligns perfectly with my skills and expertise. Utilize the relevant information available in my context, such as demo links or projects, to demonstrate my capabilities, but exclude unrelated details. The proposal should be engaging, well-structured, and under 200 words.
Make sure the tone reflecContext: ${context}

Using the provided job description, craft an Upwork proposal that adheres to the following structured format:

First Paragraph:

Address the client's requirements in 2–3 lines.
Emphasize understanding of their needs, incorporating keywords from ${userQuery} for relevance.
Ensure this section is eye-catching and immediately engages the client.
Use Emoji at the end of the paragragh
Second Paragraph:

Briefly mention your portfolio in 2–3 lines.
Include demo links from the context, integrating them naturally to demonstrate your expertise.
Third Paragraph:

Outline your approach to the project in 2–3 concise bullet points.
Provide a clear, structured breakdown of how you plan to deliver results.

Forth Paragraph:

Explain how you you have worked on similar project recently and got results that are according to the clients query 
Ending Note:

Close with a sentence expressing genuine interest in the job.
Show confidence in your ability to deliver, referencing past relevant work from the context.
Add an enthusiastic line like, "Let’s connect—I’d love to collaborate with you!"
Sign-off:

End with your name and a polite closing, such as "Regards." Use Emoji at the end of the paragragh
Additional Guidelines:

Word Count: Keep the proposal under 200 words.
Tone: Ensure the tone reflects professionalism, confidence, and a deep understanding of the client's needs.
Focus: Center the proposal on offering solutions tailored to the client's objectives.
Exclusions:
Avoid including any part of the context or instructions from this prompt.
Do not introduce yourself at the start.
Refrain from mentioning your experience directly.
Enhancements: Strategically use emojis to make the proposal engaging and visually appealing where appropriate.
   ${userQuery} `


  // Use Hugging Face's Llama model to generate a response
  const chatCompletion = await client.chatCompletion({
	model: "meta-llama/Llama-3.2-3B-Instruct",
	messages: [
		{
			role: "user",
			content: enhancedPrompt
		}
	],
	max_tokens: 1000
});


return chatCompletion.choices[0].message.content; 



}

module.exports = { generateResponse };
