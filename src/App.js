/*global chrome*/
import React, { useEffect, useState } from 'react';
import LinkedInMessageGenerator from './components/LinkedInMessageGenerator';

function App() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (chrome.tabs) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "extractData"}, (response) => {
          if (response) {
            setProfileData(response);
          }
        });
      });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>LinkedIn Cold Message Generator</h1>
      </header>
      <main>
        <LinkedInMessageGenerator profileData={profileData} />
      </main>
    </div>
  );
}

export default App;