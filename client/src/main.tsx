import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add debug logging
console.log("Debug: main.tsx loading...");
const rootElement = document.getElementById("root");
console.log("Debug: root element found:", rootElement);

try {
  createRoot(rootElement!).render(<App />);
  console.log("Debug: App rendered successfully");
} catch (error) {
  console.error("Debug: Error rendering App:", error);
}
