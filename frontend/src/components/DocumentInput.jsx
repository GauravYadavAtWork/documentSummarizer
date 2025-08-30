import React, { useState, useCallback, useEffect } from 'react';

const DocumentInput = ({ onFileSelect, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
        else if (e.type === "dragleave") setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
    }, [onFileSelect]);
    
    const handleChange = (e) => {
        if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <label
                htmlFor="file-upload"
                onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-60 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ease-in-out
                ${isDragging ? 'border-indigo-500 bg-gray-700 scale-105 shadow-lg' : 'border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500'}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <svg className={`w-10 h-10 mb-4 text-gray-400 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm sm:text-base text-gray-400">
                        <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF or Image (PNG, JPG, WEBP)</p>
                </div>
                <input id="file-upload" type="file" className="hidden" onChange={handleChange} accept=".pdf,.png,.jpg,.jpeg,.webp" disabled={isLoading} />
            </label>
        </div>
    );
};

export default DocumentInput