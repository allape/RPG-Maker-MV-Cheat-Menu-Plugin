import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { IActor } from "../../../rpgmaker/declare";
import SpriteSelector from "../../SpriteSelector";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  exp: number;
  actorId: IActor["id"];
}

export default function Exp({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [exp, expRef, setExp] = useProxy<IValue["exp"]>(10_000);
  const [id, idRef, setId] = useProxy<IActor["id"]>(-1);

  const make = useCallback(() => {
    return getRPGMaker()
      .getScriptGenerator()
      .gainExp(idRef.current, expRef.current);
  }, [expRef, idRef]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  useEffect(() => {
    if (!value) {
      return;
    }

    try {
      const v: IValue = JSON.parse(value);
      setExp((o) => v.exp || o);
      setId((o) => v.actorId || o);
    } catch (e) {
      console.error(e);
    }
  }, [setExp, setId, value]);

  useEffect(() => {
    return () => {
      onChange?.(
        JSON.stringify({
          // eslint-disable-next-line react-hooks/exhaustive-deps
          exp: expRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          actorId: idRef.current,
        } as IValue),
      );
      onScriptChange?.(make());
    };
  }, [expRef, idRef, make, onChange, onScriptChange]);

  return (
    <div className={styles.wrapper}>
      <SpriteSelector
        teamType="alias"
        value={id}
        onChange={(i) => setId(i as number)}
      />
      <input
        placeholder="Exp"
        type="number"
        step="10000"
        min={1}
        value={exp}
        onChange={(e) => setExp(+e.target.value)}
      />
      <button onClick={run}>Gain Exp</button>
    </div>
  );
}
