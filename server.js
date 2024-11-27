const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = 3000;

const AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const COUNTRY_API_BASE_URL = 'https://countryinfoapi.com/api/countries/name/';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from the "public" folder

// Fetch country data
app.get('/api/country/:name', async (req, res) => {
    const countryName = req.params.name;

    try {
        const response = await axios.get(`${COUNTRY_API_BASE_URL}${countryName}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: 'Country not found' });
    }
});

// Fetch country description using AI
app.post('/api/describe', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text input is required' });
    }

    try {
        const response = await model.generateContent(text);
        res.send(response.response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate description' + error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
