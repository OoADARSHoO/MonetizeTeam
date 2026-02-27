import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Reveal as soon as React has rendered (most common sweet spot)
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// But we wait a tiny bit longer so images/fonts don't cause reflow flash
window.addEventListener("load", () => {
  // 0–80 ms delay usually eliminates the last micro-flicker
  setTimeout(() => {
    document.documentElement.classList.remove("js-loading");
    document.documentElement.classList.add("js-loaded");
  }, 40); // ← try 0, 20, 40, 80 — pick what looks cleanest on your machine
});

// Optional: reveal even earlier if you don't care about images/fonts being perfect
// document.documentElement.classList.remove('js-loading')
// document.documentElement.classList.add('js-loaded')
