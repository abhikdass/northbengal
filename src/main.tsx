import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Initialize IndexedDB when the app starts
const initializeApp = async () => {
  try {
    // Dynamically import the IndexedDB module
    const { initDB, migrateFromLocalStorage } = await import("./lib/indexdb");
    await initDB();
    // Migrate any existing data from localStorage to IndexedDB
    await migrateFromLocalStorage();
    console.log("IndexedDB initialized successfully");
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
  }
};

// Call the initialization function
initializeApp();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
