import React, { useState, useCallback, useEffect } from 'react';
import DocumentInput from './components/DocumentInput';
import ExtractedTextView from './components/ExtractedTextView';
import SummaryView from './components/SummaryView';

// --- Helper Functions ---
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});


// --- Main App Component ---
export default function App() {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionError, setExtractionError] = useState('');
    
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState('');

    useEffect(() => {
        if (!file) return;

        const callGeminiToExtractText = async () => {
            setIsExtracting(true);
            setExtractedText('');
            setExtractionError('');
            setSummary('');
            setSummaryError('');
            
            try {
                const base64Data = await fileToBase64(file);
                const payload = {
                    contents: [ { parts: [
                        { text: "Extract all text from this document. Preserve line breaks where appropriate to maintain document structure." },
                        { inlineData: { mimeType: file.type, data: base64Data } }
                    ] } ],
                };
                
                const apiKey = ""; // Leave as-is
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || "API error during text extraction.");
                }
                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) setExtractedText(text);
                else throw new Error("Could not extract text from the document.");
            } catch (err) {
                console.error("Extraction Error:", err);
                setExtractionError(err.message);
            } finally {
                setIsExtracting(false);
            }
        };

        callGeminiToExtractText();
    }, [file]);
    
    const handleSummarize = async (length) => {
        if (!extractedText) return;
        
        setIsSummarizing(true);
        setSummary('');
        setSummaryError('');
        
        try {
            const prompt = `You are an expert summarizer. Provide a concise, easy-to-read summary of the following text. The summary should be of a '${length}' length.
- For 'short', provide a 1-2 sentence summary.
- For 'medium', provide a 1-2 paragraph summary.
- For 'long', provide a detailed, multi-paragraph summary highlighting all key points.
Here is the text:\n\n${extractedText}`;

            const payload = { contents: [{ parts: [{ text: prompt }] }] };
            const apiKey = ""; // Leave as-is
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
             if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "API error during summarization.");
            }
            const result = await response.json();
            const summaryText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (summaryText) setSummary(summaryText);
            else throw new Error("The API did not return a summary.");
        } catch(err) {
             console.error("Summarization Error:", err);
             setSummaryError(err.message);
        } finally {
            setIsSummarizing(false);
        }
    };

    const animationStyles = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; opacity: 0; animation-fill-mode: forwards; }
    `;

    return (
        <>
            <style>{animationStyles}</style>
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 text-white min-h-screen font-sans p-4 sm:p-6 md:p-8 flex flex-col">
                <div className="container mx-auto flex flex-col items-center flex-grow w-full">
                    <header className="text-center mb-8 sm:mb-12 w-full animate-fadeIn">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
                            Smart Document Summarizer
                        </h1>
                        <p className="text-md sm:text-lg text-gray-400">Upload a document to extract text and generate a summary.</p>
                    </header>

                    <main className="w-full flex flex-col items-center space-y-8 flex-grow">
                        <div className="w-full animate-slideUp" style={{ animationDelay: '200ms' }}>
                           <DocumentInput onFileSelect={setFile} isLoading={isExtracting} />
                        </div>
                        
                        <div className="w-full animate-slideUp" style={{ animationDelay: '400ms' }}>
                           <ExtractedTextView extractedText={extractedText} isLoading={isExtracting} error={extractionError} />
                        </div>
                        
                        {extractedText && !isExtracting && (
                            <div className="w-full animate-slideUp" style={{ animationDelay: '500ms' }}>
                               <SummaryView 
                                    onSummarize={handleSummarize}
                                    summary={summary}
                                    isSummarizing={isSummarizing}
                                    summaryError={summaryError}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
