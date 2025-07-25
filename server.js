import express from 'express';
import path from 'path';
// Use official Google GenAI client on server side
import fetch from 'node-fetch';
import dotenv from 'dotenv';
// Load variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const app = express();
app.use(express.json());

// Proxy endpoint for Generative Language API
app.post('/api/generateText', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model || 'text-bison-001'}:generateText?key=${apiKey}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: { text: prompt } })
    });
    // Read raw response text for debugging
    const text = await response.text();
    console.log('Raw response text from Google API:', text);
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error('Error parsing JSON from Google API:', parseErr);
      return res.status(500).json({ error: 'Invalid JSON from upstream', details: text });
    }
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
});

// Serve static assets from the dist directory
app.use(express.static(path.join(process.cwd(), 'dist')));

// HTML5 history API fallback for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App+proxy listening on port ${port}`);
});
