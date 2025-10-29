import React, { useState, useEffect, useRef } from "react";
import { sendRequest } from "./utils/sendBackend";
import { ClipLoader } from "react-spinners";

function App() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);
  const [url, setUrl] = useState("")
  const [speaking, setSpeaking] = useState(false);
  let aiReply = ""

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
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
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  // Load available voices for speech synthesis
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  // Start / Stop Speech Recognition
  const startListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
    setListening(true);
  };

  const stopListening = async () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
    console.log("getting here", url);
    setLoading(true);
    const res = await sendRequest("POST", text, url);
    console.log("response", res);
    setText(res);
    //console.log(data);
    aiReply = res;
    console.log(aiReply);
    setLoading(false);
  };

  // Speak Text with chosen voice, pitch, rate
  const speakText = () => {
    if (!text.trim()) return alert("No text to speak!");
    const synth = window.speechSynthesis;
    if (!synth) {
      alert("Speech synthesis not supported in this browser.");
      return;
    }

    synth.cancel(); // stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    synth.speak(utterance);
    setSpeaking(true);
  };

  const stopSpeak = () => {
    const synth = window.speechSynthesis;
    if(synth.speaking){
      synth.cancel();
    }
    setSpeaking(false);
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
      }}
    >
      <h2>🎙️ Speech to Text + 🔊 Natural Text to Speech</h2>
      <textarea
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        rows={1}
        cols={4}
        placeholder="Enter your url here"
        style={{
          padding:"10px",
          borderRadius: "2px",
          fontSize: "16px",
          border: "1px solid #ccc",
          width: "50%",
          maxWidth: "600px"
        }}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        cols={50}
        placeholder="Speak or type here..."
        style={{
          padding: "10px",
          borderRadius: "8px",
          fontSize: "16px",
          border: "1px solid #ccc",
          width: "80%",
          maxWidth: "600px",
        }}
      />

      <div style={{ display: "flex", gap: "1rem" }}>
        {!listening ? (
          <button onClick={startListening}>🎤 Start Listening</button>
        ) : (
          <button onClick={stopListening}>🛑 Stop Listening</button>
        )}
        {!speaking? (
          <button onClick={speakText}>🔊 Speak Text</button>
        ) : (
          <button onClick={stopSpeak}>🛑 Stop Speak</button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          width: "80%",
          maxWidth: "600px",
          background: "#fff",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <label>
          🎤 Choose Voice:{" "}
          <select
            value={selectedVoice || ""}
            onChange={(e) => setSelectedVoice(e.target.value)}
            style={{ padding: "6px", borderRadius: "6px" }}
          >
            {voices.map((v, idx) => (
              <option key={idx} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </label>

        <label>
          🏃 Rate: {rate.toFixed(1)}
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          🎵 Pitch: {pitch.toFixed(1)}
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      {listening && <p>Listening... 🟢</p>}
      {loading && <ClipLoader color="#36d7b7" />}
    </div>
  );
}

export default App;
