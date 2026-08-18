// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./assets/styles/global.css";

import App from "./App";
import SiteProvider from "./context/SiteProvider"; // <-- Site Ayarları Provider'ı eklendi

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SiteProvider>
      <App />
    </SiteProvider>

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
      }}
    />
  </StrictMode>,
);
