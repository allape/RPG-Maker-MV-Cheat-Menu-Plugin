import { useProxy } from "@allape/use-loading";
import { KeyboardEvent, ReactElement, useCallback } from "react";

export interface IKeyBinderProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function KeyBinder({
  value,
  onChange,
}: IKeyBinderProps): ReactElement {
  const [binding, bindingRef, setBinding] = useProxy<boolean>(false);

  const handleClick = useCallback(() => {
    setBinding(true);
  }, [setBinding]);

  const handleCancel = useCallback(() => {
    setBinding(false);
  }, [setBinding]);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (!bindingRef.current) {
        return;
      }
      setBinding(false);
      onChange?.(e.key);
    },
    [bindingRef, onChange, setBinding],
  );

  return (
    <button
      className="wrapper"
      title={`Keyboard key [${value}]`}
      onClick={handleClick}
      onPointerLeave={handleCancel}
      onBlur={handleCancel}
      onKeyUp={handleKeyUp}
    >
      {binding
        ? "[Esc] to clear, wait..."
        : value
          ? `[ ${value} ]`
          : "Click to bind a key"}
    </button>
  );
}
