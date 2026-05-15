import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { RootErrorBoundary } from "./components/RootErrorBoundary";

const container = document.getElementById("root")!;
const root = (container as any)._reactRoot || createRoot(container);
(container as any)._reactRoot = root;

root.render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
