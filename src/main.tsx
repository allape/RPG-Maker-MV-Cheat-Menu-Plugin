import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { getRPGMaker } from "./rpgmaker";

try {
  const maker = getRPGMaker();
  maker.evaluate(maker.getScriptGenerator().setup());
} catch (e) {
  console.error(e);
}

setTimeout(() => {
  const root = document.createElement("div");
  window.document.body.appendChild(root);

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  getRPGMaker().playSound(true);
}, 1000);
