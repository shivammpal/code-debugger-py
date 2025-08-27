import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';

// A sample piece of buggy code to start with
const sampleCode = `def my_function(a, b):
  result = a + b
  print(result)

my_function(5)`;

function App() {
  // State to hold the code the user is typing
  const [inputCode, setInputCode] = useState(sampleCode);
  // State to hold the analysis result from the backend
  const [analysisResult, setAnalysisResult] = useState(null);
  // State to show a loading message while waiting for the API
  const [isLoading, setIsLoading] = useState(false);

  // This function will be wired up on Day 4 to call the backend
  const handleDebug = () => {
    console.log("Button clicked! This will call the API tomorrow.");
  };

  return (
    <div className="app-container">
      <h1>PySleuth - AI Python Debugger 🤖</h1>
      <div className="main-content">
        {/* Input Column */}
        <div className="column">
          <h2>Your Code</h2>
          <Editor
            value={inputCode}
            onValueChange={code => setInputCode(code)}
            highlight={code => highlight(code, languages.python, 'python')}
            padding={10}
            className="editor"
          />
          <button onClick={handleDebug} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Debug Code'}
          </button>
        </div>

        {/* Output Column */}
        <div className="column">
          <h2>AI Analysis</h2>
          <div className="output-panel">
            {isLoading ? (
              <p>Loading analysis...</p>
            ) : analysisResult ? (
              <div>
                <h3>Explanation</h3>
                <p className="explanation">{analysisResult.explanation}</p>
                <hr />
                <h3>Corrected Code</h3>
                <Editor
                  value={analysisResult.corrected_code}
                  onValueChange={() => {}} // Read-only
                  highlight={code => highlight(code, languages.python, 'python')}
                  padding={10}
                  className="editor"
                  readOnly
                />
              </div>
            ) : (
              <p>Your analysis and corrected code will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;