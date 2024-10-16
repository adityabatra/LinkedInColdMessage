/*global chrome*/
import React, { useState, useCallback } from 'react';
import './LinkedInMessageGenerator.css';

const LinkedInMessageGenerator = ({ profileData }) => {
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('Generate a professional and engaging cold message based on the following LinkedIn profile information:');
  const [copySuccess, setCopySuccess] = useState('');

  const generateMessage = useCallback(async () => {
    if (!profileData) return;
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a professional networking assistant. Generate a concise and engaging cold message based on the given LinkedIn profile information."
            },
            {
              role: "user",
              content: `${prompt}
                Name: ${profileData.name}
                Title: ${profileData.title}
                About: ${profileData.about}
                Recent Post: ${profileData.recentPost}`
            }
          ],
          max_tokens: 150
        })
      });

      const data = await response.json();
      setGeneratedMessage(data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error generating message:', error);
      setGeneratedMessage('An error occurred while generating the message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [profileData, prompt]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        setCopySuccess('Failed to copy');
      });
  };

  return (
    <div className="linkedin-message-generator">
      <h3>LinkedIn Cold Message Generator</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        placeholder="Enter your custom prompt here..."
      />
      <button onClick={generateMessage} disabled={isLoading || !profileData}>
        {isLoading ? 'Generating...' : 'Generate Message'}
      </button>
      {isLoading ? (
        <p>Generating message...</p>
      ) : generatedMessage && (
        <div className="generated-message">
          <h3>Generated Cold Message:</h3>
          <p>{generatedMessage}</p>
          <div className="copy-section">
            <button onClick={copyToClipboard}>
              Copy to Clipboard
            </button>
            <span className="copy-success">{copySuccess}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInMessageGenerator;