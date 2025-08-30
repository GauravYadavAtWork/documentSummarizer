const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3001;

// --- Middleware ---

app.use(cors());
dotenv.config();

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const callGeminiApi = async (payload) => {
    console.log("calling gemini api");
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        // Create a new error object with a descriptive message
        const error = new Error(errorData.error?.message || "An unknown API error occurred.");
        error.status = response.status; // Attach status code to the error
        throw error;
    }

    return await response.json();
};


// --- API Endpoints ---

/**
 * @route POST /api/extract
 * @description Receives an uploaded file and returns extracted text.
 * Expects 'multipart/form-data' with a single file field named 'document'.
 */
app.post('/api/extract', upload.single('document'), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const file = req.file;
        const base64Data = file.buffer.toString('base64');

        const payload = {
            contents: [{
                parts: [
                    { text: "Extract all text from this document. Preserve line breaks where appropriate to maintain document structure." },
                    { inlineData: { mimeType: file.mimetype, data: base64Data } }
                ]
            }],
        };

        const result = await callGeminiApi(payload);
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            res.json({ extractedText: text });
        } else {
            throw new Error("Could not extract text from the document.");
        }

    } catch (error) {
        console.error("Extraction Error:", error.message);
        // Pass the error to the global error handler
        next(error);
    }
});

/**
 * @route POST /api/summarize
 * @description Receives text and a length, returns a summary.
 * Expects a JSON body: { "textToSummarize": "...", "length": "..." }
 */
app.post('/api/summarize', async (req, res, next) => {
    const { textToSummarize, length } = req.body;

    if (!textToSummarize || !length) {
        return res.status(400).json({ error: 'Missing textToSummarize or length in request body.' });
    }

    try {
        const prompt = `You are an expert summarizer. Provide a concise, easy-to-read summary of the following text. The summary should be of a '${length}' length.
- For 'short', provide a 1-2 sentence summary.
- For 'medium', provide a 1-2 paragraph summary.
- For 'long', provide a detailed, multi-paragraph summary highlighting all key points.
Here is the text:\n\n${textToSummarize}`;
        
        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        const result = await callGeminiApi(payload);
        const summaryText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (summaryText) {
            res.json({ summary: summaryText });
        } else {
            throw new Error("The API did not return a summary.");
        }

    } catch (error) {
        console.error("Summarization Error:", error.message);
        // Pass the error to the global error handler
        next(error);
    }
});


// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Something went wrong on the server.';
    res.status(status).json({ error: message });
});


// --- Start Server ---
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
