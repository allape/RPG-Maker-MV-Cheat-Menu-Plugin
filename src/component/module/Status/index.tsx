import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { IActor, IStatus } from "../../../rpgmaker/declare";
import SpriteSelector from "../../SpriteSelector";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  value: number;
  actorId: IActor["id"];
  statId: IStatus["id"];
}

export default function Status({
  value: valueFromProps,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [value, valueRef, setValue] = useProxy<IValue["value"]>(10);
  const [actorId, actorIdRef, setActorId] = useProxy<IValue["actorId"]>(-1);
  const [statId, statIdRef, setStatId] = useProxy<IValue["statId"]>(-1);

  const make = useCallback(() => {
    return getRPGMaker()
      .getScriptGenerator()
      .gainStatus(actorIdRef.current, statIdRef.current, valueRef.current);
  }, [actorIdRef, statIdRef, valueRef]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  const reload = useCallback(() => {
    if (actorId === undefined) {
      setStatuses([]);
      return;
    }

    setStatuses(getRPGMaker().getStatusList(actorId));
  }, [actorId]);

  const [statuses, setStatuses] = useState<IStatus[]>([]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (!valueFromProps) {
      return;
    }

    try {
      const v: IValue = JSON.parse(valueFromProps);
      setValue((o) => v.value || o);
      setActorId((o) => v.actorId || o);
      setStatId((o) => v.statId || o);
    } catch (e) {
      console.error(e);
    }
  }, [setActorId, setStatId, setValue, valueFromProps]);

  useEffect(() => {
    return () => {
      onChange?.(
        JSON.stringify({
          // eslint-disable-next-line react-hooks/exhaustive-deps
          value: valueRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          actorId: actorIdRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          statId: statIdRef.current,
        } as IValue),
      );
      onScriptChange?.(make());
    };
  }, [actorIdRef, make, onChange, onScriptChange, statIdRef, valueRef]);

  return (
    <div className={styles.wrapper}>
      <SpriteSelector
        teamType="alias"
        value={actorId}
        onChange={(i) => setActorId(i as number)}
      />
      <select value={statId} onChange={(e) => setStatId(+e.target.value)}>
        <option value={-1}>-</option>
        {statuses.map((a, i) => (
          <option key={i} value={`${a.id}`}>
            {a.name}
          </option>
        ))}
      </select>
      <div className={styles.row}>
        <input
          placeholder="Current Value"
          type="number"
          value={statuses.find((s) => s.id === statId)?.value || 0}
          readOnly
        />
        <input
          placeholder="State Value for Change"
          type="number"
          value={value}
          onChange={(e) => setValue(+e.target.value)}
        />
      </div>
      <div className={styles.row}>
        <button onClick={reload}>Reload</button>
        <button
          onClick={() => {
            run();
            reload();
          }}
        >
          {value <= 0 ? "-" : "+"} Stat
        </button>
      </div>
    </div>
  );
}
