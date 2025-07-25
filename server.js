import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Proxy endpoint for Generative Language API
app.post('/api/generateText', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    const key = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateText?key=${key}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: { text: prompt }, model })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', details: err.message });
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
