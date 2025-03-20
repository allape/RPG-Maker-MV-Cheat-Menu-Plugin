import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

export default function SpeedHack({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [v, vRef, setV] = useProxy<number>(0);

  const make = useCallback(() => {
    return getRPGMaker()
      .getScriptGenerator()
      .speedHack(vRef.current * 60);
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
    <div
      className={styles.wrapper}
      title={"Warning: High speed may cause game to crash"}
    >
      <input
        type="range"
        min="0"
        max="5"
        step="1"
        value={v}
        onChange={(e) => setV(+e.target.value)}
      />
      <button onClick={run}>
        {v}x <br /> Faster
      </button>
    </div>
  );
}
