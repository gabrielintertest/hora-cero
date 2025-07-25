import express from 'express';
import path from 'path';
// Use official Google GenAI client on server side
import { TextServiceClient } from '@google/genai';
import dotenv from 'dotenv';
// Load variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const app = express();
app.use(express.json());

// Proxy endpoint for Generative Language API
app.post('/api/generateText', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    // Initialize GenAI client with API key
    const client = new TextServiceClient({ apiKey: process.env.GEMINI_API_KEY });
    // Call the API
    const [response] = await client.generateText({
      model: model || 'text-bison-001',
      prompt: { text: prompt }
    });
    // Send back the full response as JSON
    return res.status(200).json({ candidates: [{ output: response.text }] });
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
