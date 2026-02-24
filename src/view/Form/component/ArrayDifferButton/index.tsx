import { ReactElement, useCallback, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import ArrayDiffer from "../../../../component/ArrayDiffer";

declare interface IWindow extends Window {
  __differRoot?: Root;
  __differElement?: HTMLElement;
}

function diffizedWindow(): IWindow {
  return window as IWindow;
}

function mount(): Root {
  const differ = diffizedWindow().__differRoot;
  if (differ) {
    return differ;
  }

  const ele = document.createElement("div");
  document.body.appendChild(ele);

  const root = createRoot(ele);

  root.render(<ArrayDiffer />);

  diffizedWindow().__differRoot = root;
  diffizedWindow().__differElement = ele;

  return root;
}

function unmount(): void {
  const differ = diffizedWindow().__differRoot;
  if (!differ) {
    return;
  }

  differ.unmount();
  delete diffizedWindow().__differRoot;
  diffizedWindow().__differElement?.remove();
}

export default function ArrayDifferButton(): ReactElement {
  const [visible, setVisible] = useState<boolean>(
    () => !!diffizedWindow().__differRoot,
  );

  const handleToggle = useCallback(() => {
    setVisible((o) => {
      setTimeout(() => {
        if (o) {
          unmount();
        } else {
          mount();
        }
      });

      return !o;
    });
  }, []);

  return (
    <>
      <button style={{ whiteSpace: "nowrap" }} onClick={handleToggle}>
        {visible ? "Close" : "Open"} Array Differ
      </button>
    </>
  );
}
