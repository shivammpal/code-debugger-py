import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// --- ICONS ---
const CopyIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);
const GithubIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>);
const SpeakerIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>);


const sampleCode = `def fibonacci(n):
    if n <= 0:
        return "Incorrect input"
    elif n == 1:
        return 0
    elif n == 2:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# Calling with a string will cause an error
print(fibonacci("5"))
`;

function App() {
  const [inputCode, setInputCode] = useState(sampleCode);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // State for speaker button

  const handleDebug = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    window.speechSynthesis.cancel(); // Stop any speech on new analysis
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const promise = axios.post(`${apiUrl}/debug`, { code: inputCode });

    toast.promise(promise, {
      loading: 'Helper is thinking...',
      success: (response) => {
        setAnalysisResult(response.data);
        return 'Analysis complete!';
      },
      error: (err) => {
        setAnalysisResult({
          has_errors: true,
          explanation: "Failed to connect to the backend. Please ensure the server is running.",
          corrected_code: `Error: ${err.message || "Could not retrieve data."}`
        });
        return 'Connection failed!';
      },
    });

    try {
      await promise;
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysisResult && analysisResult.corrected_code) {
      navigator.clipboard.writeText(analysisResult.corrected_code);
      toast.success('Copied to clipboard!');
    }
  };

  // --- NEW FUNCTION FOR TEXT-TO-SPEECH ---
  const handleSpeak = () => {
    if (isSpeaking || !analysisResult?.explanation) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(analysisResult.explanation);

    // Add event listeners to manage the speaking state
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="aurora-background min-h-screen text-gray-100 flex flex-col items-center p-4 md:p-6 font-sans">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#334155', color: '#fff' },
      }} />
      
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl flex justify-between items-center mb-10 mt-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">🤖</span>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
            PyHelper
          </h1>
        </div>
        <a href="https://github.com/shivammpal" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
          <GithubIcon />
        </a>
      </motion.header>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-300 mb-4">Your Code</h2>
          <div className="flex-1 bg-black/20 border border-white/10 rounded-lg overflow-hidden shadow-inner min-h-[350px]">
            <Editor
              value={inputCode}
              onValueChange={code => setInputCode(code)}
              highlight={code => highlight(code, languages.python, 'python')}
              textareaClassName="editor-shared"
              preClassName="editor-shared"
            />
          </div>
          <button 
            onClick={handleDebug} 
            disabled={isLoading} 
            className="mt-6 w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'Debug Code'}
          </button>
        </motion.div>

        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-300 mb-4">AI Analysis</h2>
          <div className="flex-1 bg-black/20 rounded-lg p-5 overflow-auto text-sm shadow-inner min-h-[440px]">
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-black/20 p-4 rounded-md border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-blue-400">Explanation</h3>
                    <button 
                      onClick={handleSpeak} 
                      disabled={isSpeaking}
                      className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                      title="Read explanation aloud"
                    >
                      <SpeakerIcon /> {isSpeaking ? 'Speaking...' : 'Speak'}
                    </button>
                  </div>
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{analysisResult.explanation}</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-md border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-blue-400">Corrected Code</h3>
                    <button onClick={handleCopy} className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md flex items-center gap-2 transition-all duration-200">
                      <CopyIcon /> Copy
                    </button>
                  </div>
                  <div className="bg-black/20 overflow-auto border border-white/10 rounded-lg shadow-inner min-h-[150px]">
                    <Editor
                      value={analysisResult.corrected_code}
                      onValueChange={() => {}}
                      highlight={code => highlight(code, languages.python, 'python')}
                      readOnly
                      textareaClassName="editor-shared"
                      preClassName="editor-shared"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            {!analysisResult && !isLoading && (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                <p>Your AI-powered analysis will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
