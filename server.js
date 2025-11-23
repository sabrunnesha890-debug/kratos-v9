const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('.')); // index.html serve karega

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/gemini-defense-test', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent([
      req.body.systemInstruction ? { text: req.body.systemInstruction } : null,
      { text: req.body.userQuery }
    ].filter(Boolean));
    
    const text = await result.response.text();
    
    res.json({
      candidates: [{
        content: {
          parts: [{ text }]
        }
      }]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`KRATOS v9 running on port ${PORT}`);
});