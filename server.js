// Simple proxy server to call Google Generative Language API and avoid CORS issues
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/api/generateText', async (req, res) => {
  try {
    const { prompt } = req.body;
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/text-bison-001:generateText?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: { text: prompt }, model: 'text-bison-001' })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Proxy server running on port ${port}`));
