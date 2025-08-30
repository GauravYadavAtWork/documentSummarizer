
import React, { useState, useCallback, useEffect } from 'react';

// 3. SummaryView Component
const SummaryView = ({ onSummarize, summary, isSummarizing, summaryError }) => {
    
    const SummaryDisplay = () => {
        if (isSummarizing) {
            return (
                <div className="p-4 bg-gray-900/50 rounded-lg animate-pulse mt-4">
                    {/* Skeleton loader for summary */}
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
            );
        }
        if (summaryError) {
             return (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500 text-red-300 rounded-lg">
                    <h3 className="font-bold mb-2 flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>Error During Summarization</h3>
                    <p className="pl-7">{summaryError}</p>
                </div>
            );
        }
        if (summary) {
             return <p className="whitespace-pre-wrap text-gray-300 font-sans text-base leading-relaxed mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">{summary}</p>
        }
        return <p className="text-gray-500 italic mt-4">Select a length to generate a summary.</p>
    };
    
    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 mt-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Generate Summary</h2>
            <div className="flex flex-wrap gap-3">
                {['Short', 'Medium', 'Long'].map(length => (
                    <button
                        key={length}
                        onClick={() => onSummarize(length.toLowerCase())}
                        disabled={isSummarizing}
                        className="px-5 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-800/50 disabled:cursor-not-allowed transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transform hover:scale-105 active:scale-95"
                    >
                        {length}
                    </button>
                ))}
            </div>
             <SummaryDisplay />
        </div>
    );
};



export default SummaryView