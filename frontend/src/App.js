import React, { useState, useEffect, useRef } from "react";

function App() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Idle");

  const silenceTimer = useRef(null);
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
      resetSilenceTimer();
    };

    recognition.onerror = (e) => console.error("Speech error:", e);

    recognition.onend = () => {
      // Automatically restart if still supposed to listen
      if (listening) recognition.start();
    };
  }, [listening, recognition]);

  // --- Silence detection ---
  const resetSilenceTimer = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      handleSilence();
    }, 30000); // 30 seconds
  };

  const handleSilence = () => {
    stopListening();
    setStatus("Stopped due to 30s silence");
  };

  // --- Start/Stop listening ---
  const startListening = () => {
    if (!recognition) return alert("Speech recognition not supported.");
    recognition.start();
    setListening(true);
    setStatus("Listening... 🟢");
    resetSilenceTimer();
  };

  const stopListening = () => {
    if (!recognition) return;
    recognition.stop();
    setListening(false);
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    setStatus("Idle");
  };

  // --- Text-to-Speech ---
  const speakText = () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
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
        fontFamily: "sans-serif",
      }}
    >
      <h2>🎤 Speech to Text & 🔊 Text to Speech</h2>
      <p>Status: {status}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        cols={50}
        placeholder="Speak or type here..."
        style={{ padding: "0.5rem", borderRadius: "6px" }}
      />
      <div style={{ display: "flex", gap: "1rem" }}>
        {!listening ? (
          <button onClick={startListening}>Start Listening</button>
        ) : (
          <button onClick={stopListening}>Stop Listening</button>
        )}
        <button onClick={speakText}>🔊 Speak Text</button>
      </div>
      {listening && <p>Listening... 🟢</p>}
    </div>
  );
}

export default App;
