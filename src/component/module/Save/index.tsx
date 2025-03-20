import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

export default function Save({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [v, vRef, setV] = useProxy<number>(2);

  const make = useCallback(() => {
    return getRPGMaker()
      .getScriptGenerator()
      .saveGame(vRef.current >> 0);
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
        step="1"
        min={0}
        value={v}
        onChange={(e) => setV(parseInt(e.target.value))}
      />
      <button onClick={run}>
        Save <br /> Now
      </button>
    </div>
  );
}
