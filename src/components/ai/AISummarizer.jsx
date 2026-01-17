import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Bot, Loader2, Key, Sparkles, X } from 'lucide-react';

const AISummarizer = ({ isOpen, onClose, contextContent, onApplySummary }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('Create a structured study guide with key takeaways and definitions based on the provided text.');
  const [inputText, setInputText] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');

  const handleSaveKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
  };

  const generateSummary = async () => {
    if (!apiKey) return alert('Please enter a Gemini API Key');
    
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const textToAnalyze = inputText || contextContent;
      if (!textToAnalyze) {
        setLoading(false);
        return alert('Please paste some text or transcript to analyze.');
      }

      const fullPrompt = `${prompt}\n\nHere is the text:\n${textToAnalyze}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      setGeneratedSummary(text);
    } catch (error) {
      console.error(error);
      alert('Error generating summary: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl text-white">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-bold">AI Study Assistant</span>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* API Key Input */}
          {!localStorage.getItem('gemini_api_key') && (
             <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-3">
               <Key className="w-4 h-4 shrink-0" />
               <input 
                 type="password" 
                 placeholder="Enter Gemini API Key" 
                 className="bg-transparent border-b border-yellow-400 focus:outline-none w-full"
                 value={apiKey}
                 onChange={(e) => setApiKey(e.target.value)}
                 onBlur={handleSaveKey}
               />
               <a href="https://aistudio.google.com/app/apikey" target="_blank" className="underline whitespace-nowrap">Get Key</a>
             </div>
          )}

          {/* Input Area */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Content to Analyze (e.g. Video Transcript)
            </label>
            <textarea 
              className="w-full h-32 p-3 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Paste the video transcript or notes here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* Prompt Selection */}
          <div>
             <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Goal
            </label>
            <select 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="Create a structured study guide with key takeaways and definitions.">Create Study Guide</option>
              <option value="Summarize this text in 3 concise bullet points.">Quick Summary</option>
              <option value="Generate 5 quiz questions based on this text.">Generate Quiz</option>
              <option value="Explain this to a 5 year old.">Simplify</option>
            </select>
          </div>

          {/* Result Area */}
          {generatedSummary && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-gray-800 dark:text-white">AI Result</h3>
                 <button 
                   onClick={() => onApplySummary(generatedSummary)}
                   className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded hover:bg-green-200 transition"
                 >
                   Insert into Notes
                 </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border dark:border-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                {generatedSummary}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-b-xl flex justify-end">
           <button 
             onClick={generateSummary}
             disabled={loading}
             className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
             {loading ? 'Thinking...' : 'Generate Magic'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default AISummarizer;
