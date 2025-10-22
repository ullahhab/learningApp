import React, { useState, useEffect } from "react";

function App() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");

  // Check browser support
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setText(finalTranscript);
    };

    recognition.onerror = (e) => console.error("Speech error:", e);
  }, []);

  const startListening = () => {
    if (!recognition) return alert("Speech recognition not supported.");
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (!recognition) return;
    recognition.stop();
    setListening(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      <h2>🎤 Speech to Text</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        cols={50}
        placeholder="Speak or type here..."
      />
      <div>
        {!listening ? (
          <button onClick={startListening}>Start Listening</button>
        ) : (
          <button onClick={stopListening}>Stop Listening</button>
        )}
      </div>
      {listening && <p>Listening... 🟢</p>}
    </div>
  );
}

export default App;