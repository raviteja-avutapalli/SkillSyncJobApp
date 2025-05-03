const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables from .env file
require('dotenv').config();

router.post('/', async (req, res) => {
  const userMessage = req.body.message;
  const prompt = `### Instruction:
You are a helpful career coach. Answer briefly and clearly.

### Input:
${userMessage}

### Response:`;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data?.[0]?.generated_text || 'Sorry, I couldn’t understand that.';
    res.json({ reply: botReply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'AI service failed' });
  }
});

module.exports = router;
