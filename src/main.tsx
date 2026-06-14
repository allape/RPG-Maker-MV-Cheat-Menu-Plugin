import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { getRPGMaker } from "./rpgmaker";
import { IRPGMaker } from "./rpgmaker/declare";

interface ICheatWindow extends Window {
  __AS_CHEATER__?: IRPGMaker;
}

const MaxTryCount = 30;

try {
  const maker = getRPGMaker();
  maker.evaluate(maker.getScriptGenerator().setup());
} catch (e) {
  console.error(e);
}

let count = 0;

const id = setInterval(() => {
  if (count++ > MaxTryCount) {
    clearInterval(id);
    alert("Failed to load RPG Maker MV/MZ");
    return;
  }

  if (!getRPGMaker().getTitle()) {
    return;
  }

  clearInterval(id);

  const root = document.createElement("div");
  root.id = "AS_CHEAT_MENU_ROOT";
  window.document.body.appendChild(root);

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  getRPGMaker().playSound(true);

  (window as ICheatWindow).__AS_CHEATER__ = getRPGMaker();
}, 1000);
