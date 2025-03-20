import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

export default function Script({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [v, vRef, setV] = useProxy<string>("");

  const run = useCallback(() => {
    getRPGMaker().evaluate(vRef.current);
  }, [vRef]);

  useEffect(() => {
    if (value) {
      setV((v) => value || v);
    }
  }, [setV, value]);

  useEffect(() => {
    return () => {
      onChange?.(vRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      onScriptChange?.(vRef.current);
    };
  }, [onChange, onScriptChange, vRef]);

  return (
    <div className={styles.wrapper}>
      <textarea
        rows={5}
        placeholder="Javascript"
        value={v}
        onChange={(e) => setV(e.target.value)}
      />
      <button onClick={run}>Execute</button>
    </div>
  );
}
