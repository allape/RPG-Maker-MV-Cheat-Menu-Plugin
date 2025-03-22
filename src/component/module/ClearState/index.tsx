import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { IActor } from "../../../rpgmaker/declare";
import SpriteSelector from "../../SpriteSelector";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  actorId: IActor["id"];
}

export default function ClearState({
  value: valueFromProps,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [actorId, actorIdRef, setActorId] = useProxy<IValue["actorId"]>(-1);

  const make = useCallback(() => {
    return getRPGMaker().getScriptGenerator().clearState(actorIdRef.current);
  }, [actorIdRef]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  useEffect(() => {
    if (!valueFromProps) {
      return;
    }

    try {
      const v: IValue = JSON.parse(valueFromProps);
      setActorId((o) => v.actorId || o);
    } catch (e) {
      console.error(e);
    }
  }, [setActorId, valueFromProps]);

  useEffect(() => {
    return () => {
      onChange?.(
        JSON.stringify({
          // eslint-disable-next-line react-hooks/exhaustive-deps
          actorId: actorIdRef.current,
        } as IValue),
      );
      onScriptChange?.(make());
    };
  }, [actorIdRef, make, onChange, onScriptChange]);

  return (
    <div className={styles.wrapper}>
      <SpriteSelector
        teamType="alias"
        value={actorId}
        onChange={(i) => setActorId(i as number)}
      />
      <button onClick={run}>Clear</button>
    </div>
  );
}
