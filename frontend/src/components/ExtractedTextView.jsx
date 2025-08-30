
import React, { useState, useCallback, useEffect } from 'react';


// 2. ExtractedTextView Component
const ExtractedTextView = ({ extractedText, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="w-full max-w-3xl mx-auto p-6 mt-8 bg-gray-800 rounded-lg shadow-lg animate-pulse">
                {/* Skeleton loader */}
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
                 <div className="flex items-center justify-center mt-6">
                    <svg className="w-8 h-8 text-gray-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                     <p className="ml-3 text-gray-400">Extracting text from document...</p>
                 </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="w-full max-w-3xl mx-auto p-6 mt-8 bg-red-900/20 border border-red-500 text-red-300 rounded-lg">
                <h3 className="font-bold mb-2 flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>Error During Extraction</h3>
                <p className="pl-7">{error}</p>
            </div>
        );
    }

    if (!extractedText) {
        return (
             <div className="w-full max-w-3xl mx-auto p-10 mt-8 bg-gray-800 rounded-lg text-center border border-dashed border-gray-700">
                 <p className="text-gray-500">Your extracted document text will appear here.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 mt-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-600 pb-2">Extracted Text</h2>
            <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm leading-relaxed max-h-[50vh] overflow-y-auto pr-2">{extractedText}</pre>
        </div>
    );
};

export default ExtractedTextView