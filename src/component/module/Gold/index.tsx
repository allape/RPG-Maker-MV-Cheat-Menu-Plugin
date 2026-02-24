import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

export default function Gold({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [v, vRef, setV] = useProxy<number>(10_000_000);

  const make = useCallback(() => {
    return getRPGMaker().getScriptGenerator().gainGold(vRef.current);
  }, [vRef]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  useEffect(() => {
    if (value) {
      setV((v) => parseInt(value) || v);
    }
  }, [setV, value]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      onChange?.(`${vRef.current}`);
      onScriptChange?.(make());
    };
  }, [make, onChange, onScriptChange, vRef]);

  return (
    <div className={styles.wrapper}>
      <input
        type="number"
        step="10000"
        value={v}
        onChange={(e) => setV(parseInt(e.target.value))}
      />
      <button onClick={run}>
        {v <= 0 ? "-" : "+"} <br />{" "}
        <span style={{ color: "orange" }}>Gold</span>
      </button>
    </div>
  );
}
