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

let count = 0;

const id = setInterval(() => {
  if (count++ > 100) {
    clearInterval(id);
    alert("Failed to load RPG Maker MV/MZ");
    return;
  }

  if (!getRPGMaker().getTitle()) {
    return;
  }

  clearInterval(id);

  const root = document.createElement("div");
  window.document.body.appendChild(root);

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  getRPGMaker().playSound(true);
}, 1000);
