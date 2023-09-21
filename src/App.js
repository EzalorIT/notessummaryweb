import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React, { useState } from "react";
import axios from 'axios'
import awsExports from './aws-exports';

const components = {
  Header() {
    return <h1>Meeting Summarisation App</h1>;
  }
};

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  function handleSubmit(event) {
    event.preventDefault()
    const url = awsExports.API_GW;
    const url_generate_pre_signed = url+"/pre_signed_url?file="+selectedFile.name+"&name="+event.target.user.value
    axios.get(url_generate_pre_signed)
    .then(function (result) {
      var signedUrl = result.data.pre_signed_url;
      var options = {
        headers: {
          'Content-Type': selectedFile.type,
        }
      };
      return axios.put(signedUrl, selectedFile, options);
    })
    .then(function (result) {
      alert("File upload success - you will receive an email shortly");
    })
    .catch(function (err) {
      alert("File upload error!");
    });
  }
  function handleChange(event) {
    setSelectedFile(event.target.files[0])
  };

  return (
      <Authenticator
      components={components}
      >
          {({ signOut, user }) => (
              <div>
                  <button className="sign-out" onClick={signOut}>Sign out</button>
                  <h1>AWS LocalGov - Transcribe & Translate Tool</h1>
                  <h2>Use this service to:</h2>
                  <ul>
                    <li>Transcribe an audio file (meeting) and provide full notes</li>
                    <li>Identify each speaker as part of the transcription</li>
                    <li>Translate the audio from <a href="https://docs.aws.amazon.com/translate/latest/dg/what-is-languages.html">supported languages</a> into English</li>
                    <li>Provide a short summary (1-2 lines) of the transcription</li>
                  </ul>
                  <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleChange}/>
                    <input type="hidden" name="user" value={user.username} />
                    <button type="submit">Submit</button>
                  </form>
              </div>
          )}
      </Authenticator>
  );
}

export default App;
