import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  min: number;
  max: number;
}

export default function SaveInRoll({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [min, minRef, setMin] = useProxy<IValue["min"]>(2);
  const [max, maxRef, setMax] = useProxy<IValue["max"]>(6);

  const make = useCallback(() => {
    return getRPGMaker()
      .getScriptGenerator()
      .saveGameInRoll(minRef.current, maxRef.current);
  }, [maxRef, minRef]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  useEffect(() => {
    if (!value) {
      return;
    }

    try {
      const v: IValue = JSON.parse(value);
      setMin((o) => v.min || o);
      setMax((o) => v.max || o);
    } catch (e) {
      console.error(e);
    }
  }, [setMax, setMin, value]);

  useEffect(() => {
    return () => {
      onChange?.(
        JSON.stringify({
          // eslint-disable-next-line react-hooks/exhaustive-deps
          min: minRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          max: maxRef.current,
        } as IValue),
      );
      onScriptChange?.(make());
    };
  }, [make, maxRef, minRef, onChange, onScriptChange]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <input
          type="number"
          step="1"
          min={0}
          max={max}
          value={min}
          onChange={(e) => setMin(parseInt(e.target.value))}
        />
        <input
          type="number"
          step="1"
          min={min}
          value={max}
          onChange={(e) => setMax(parseInt(e.target.value))}
        />
      </div>
      <button onClick={run}>
        Save <br /> Now
      </button>
    </div>
  );
}
