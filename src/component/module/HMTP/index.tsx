import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import {
  HMTP as HMTPType,
  HMTPValue,
  IActor,
  TeamType,
} from "../../../rpgmaker/declare";
import SpriteSelector, { Value } from "../../SpriteSelector";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  teamType: TeamType;
  actorId: Value;
  type: HMTPType;
  valueType: Exclude<HMTPValue, number> | "custom";
  customValue: number;
}

export default function HMTP({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [teamType, teamTypeRef, setTeamType] =
    useProxy<IValue["teamType"]>("alias");
  const [actorId, actorIdRef, setActorId] = useProxy<
    IValue["actorId"] | undefined
  >("all");
  const [type, typeRef, setType] = useProxy<IValue["type"]>("hp");
  const [valueType, valueTypeRef, setValueType] =
    useProxy<IValue["valueType"]>("full");
  const [customValue, customValueRef, setCustomValue] =
    useProxy<IValue["customValue"]>(0);

  const make = useCallback(() => {
    const maker = getRPGMaker();
    const scriptMaker = maker.getScriptGenerator();

    let hmtpType: HMTPValue;
    if (valueTypeRef.current === "custom") {
      hmtpType = customValueRef.current;
    } else {
      hmtpType = valueTypeRef.current;
    }

    let aliveOrActorID: boolean | IActor | undefined;
    switch (actorIdRef.current) {
      case "all":
        aliveOrActorID = false;
        break;
      case "alive":
        aliveOrActorID = true;
        break;
      default:
        aliveOrActorID = maker
          .getAliasList()
          .find((alias) => alias.id === actorIdRef.current);
        if (!aliveOrActorID) {
          maker.playSound(false);
          return "";
        }
        break;
    }

    return scriptMaker.setHMTP(
      teamTypeRef.current,
      aliveOrActorID,
      typeRef.current,
      hmtpType,
    );
  }, [actorIdRef, customValueRef, teamTypeRef, typeRef, valueTypeRef]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  useEffect(() => {
    if (!value) {
      return;
    }
    try {
      const v: IValue = JSON.parse(value);
      setTeamType((o) => v.teamType || o);
      setActorId((o) => v.actorId || o);
      setType((o) => v.type || o);
      setValueType((o) => v.valueType || o);
      setCustomValue((o) => v.customValue || o);
    } catch (e) {
      console.error(e);
    }
  }, [setActorId, setCustomValue, setTeamType, setType, setValueType, value]);

  useEffect(() => {
    return () => {
      onChange?.(
        JSON.stringify({
          // eslint-disable-next-line react-hooks/exhaustive-deps
          teamType: teamTypeRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          actorId: actorIdRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          type: typeRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          valueType: valueTypeRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          customValue: customValueRef.current,
        } as IValue),
      );
      onScriptChange?.(make());
    };
  }, [
    actorIdRef,
    customValueRef,
    make,
    onChange,
    onScriptChange,
    teamTypeRef,
    typeRef,
    valueTypeRef,
  ]);

  return (
    <div className={styles.wrapper}>
      <select
        value={teamType}
        onChange={(e) => setTeamType(e.target.value as IValue["teamType"])}
      >
        <option value="alias">Alias</option>
        <option value="enemy">Enemy</option>
      </select>
      <div className={styles.row}>
        <SpriteSelector
          all
          alive
          teamType={teamType}
          value={actorId}
          onChange={setActorId}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as IValue["type"])}
        >
          <option value="hp">HP</option>
          <option value="mp">MP</option>
          <option value="tp">TP</option>
        </select>
      </div>
      <select
        value={valueType}
        onChange={(e) => setValueType(e.target.value as IValue["valueType"])}
      >
        <option value="full">Full</option>
        <option value="half">Half</option>
        <option value="1">1</option>
        <option value="0">0</option>
        <option value="custom">Custom</option>
      </select>
      {valueType === "custom" && (
        <input
          type="number"
          min="0"
          step="1"
          value={customValue}
          onChange={(e) => setCustomValue(+e.target.value)}
        />
      )}
      <button onClick={run}>Set Now</button>
    </div>
  );
}
