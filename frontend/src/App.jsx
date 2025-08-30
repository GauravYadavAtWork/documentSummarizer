import React, { useState, useCallback, useEffect } from 'react';
import DocumentInput from './components/DocumentInput';
import ExtractedTextView from './components/ExtractedTextView';
import SummaryView from './components/SummaryView';

// --- Main App Component ---
export default function App() {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionError, setExtractionError] = useState('');
    
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState('');

    // This useEffect hook now calls your backend server instead of the Gemini API directly.
    useEffect(() => {
        if (!file) return;

        const processFileWithBackend = async () => {
            setIsExtracting(true);
            setExtractedText('');
            setExtractionError('');
            setSummary('');
            setSummaryError('');
            
            // Use FormData to send the file to the backend.
            const formData = new FormData();
            formData.append('document', file); // 'document' must match the key in your backend's multer setup.

            try {
                const backendUrl = 'https://documentsummarizer.onrender.com/api/extract';
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    body: formData, // Browser automatically sets the correct Content-Type for FormData
                });

                const data = await response.json();

                if (!response.ok) {
                    // Throw an error with the message provided by the backend.
                    throw new Error(data.error || 'API error during text extraction.');
                }
                
                setExtractedText(data.extractedText);

            } catch (err) {
                console.error("Extraction Error:", err);
                setExtractionError(err.message);
            } finally {
                setIsExtracting(false);
            }
        };

        processFileWithBackend();
    }, [file]);
    
    // This function now calls your backend server for summarization.
    const handleSummarize = async (length) => {
        if (!extractedText) return;
        
        setIsSummarizing(true);
        setSummary('');
        setSummaryError('');
        
        try {
            const backendUrl = 'https://documentsummarizer.onrender.com/api/summarize';
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    textToSummarize: extractedText,
                    length: length
                })
            });
            
            const data = await response.json();

            if (!response.ok) {
                // Throw an error with the message provided by the backend.
                throw new Error(data.error || 'API error during summarization.');
            }
            
            setSummary(data.summary);

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

