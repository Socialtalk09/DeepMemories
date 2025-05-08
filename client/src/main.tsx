import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add enhanced debug logging
console.log("Debug: main.tsx loading...");
const rootElement = document.getElementById("root");
console.log("Debug: root element found:", rootElement);

// Add a global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  // Log current location
  console.log("Debug: Current location:", window.location.href);
  
  // Set up the React app
  const root = createRoot(rootElement!);
  root.render(<App />);
  console.log("Debug: App rendered successfully");
} catch (error) {
  console.error("Debug: Error rendering App:", error);
}
