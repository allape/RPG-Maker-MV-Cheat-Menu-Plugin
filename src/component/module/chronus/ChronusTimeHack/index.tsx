import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../../rpgmaker";
import { ICheatModuleProps } from "../../declare";
import styles from "./style.module.scss";

export default function ChronusTimeHack({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [v, vRef, setV] = useProxy<number>(60);

  const make = useCallback(() => {
    return `$gameSystem.chronus().addTime(${vRef.current});`;
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
        placeholder="In Minutes"
        step="60"
        min={0}
        value={v}
        onChange={(e) => setV(parseInt(e.target.value))}
      />
      <button onClick={run}>{v <= 0 ? "-" : "+"}</button>
    </div>
  );
}
