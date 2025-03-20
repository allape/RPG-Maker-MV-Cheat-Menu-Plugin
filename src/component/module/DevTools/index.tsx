import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { ICheatModuleProps } from "../declare";

export default function DevTools({
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const make = useCallback(
    () => getRPGMaker().getScriptGenerator().openDevTools(),
    [],
  );

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  useEffect(() => {
    return () => {
      onScriptChange?.(make());
    };
  }, [make, onScriptChange]);

  return (
    <button style={{ flex: 1 }} onClick={run}>
      Open DevTools
    </button>
  );
}
