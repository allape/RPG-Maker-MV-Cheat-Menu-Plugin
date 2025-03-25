import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { ISwitch } from "../../../rpgmaker/declare";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  index: string;
  keyword: string;
  value: boolean;
}

export default function Switch({
  value: valueFromProps,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [index, indexRef, setIndex] = useProxy<IValue["index"]>("");
  const [keyword, keywordRef, setKeyword] = useProxy<IValue["keyword"]>("");
  const [value, valueRef, setValue] = useProxy<IValue["value"]>(false);

  const [source, sourceRef, setSource] = useProxy<ISwitch[]>([]);
  const [list, listRef, setList] = useProxy<string[]>([]);
  const [renderingList, setRenderingList] = useState<string[]>([]);

  const make = useCallback(() => {
    const maker = getRPGMaker();
    const swi = sourceRef.current[listRef.current.indexOf(indexRef.current)];
    if (!swi) {
      return "";
    }
    return maker.getScriptGenerator().setSwitch(swi, valueRef.current);
  }, [indexRef, listRef, sourceRef, valueRef]);

  useEffect(() => {
    if (!valueFromProps) {
      return;
    }

    try {
      const v: IValue = JSON.parse(valueFromProps);
      setIndex((o) => v.index || o);
      setValue((o) => v.value || o);
      setKeyword((o) => v.keyword || o);
    } catch (e) {
      console.error(e);
    }
  }, [setIndex, setKeyword, setValue, valueFromProps]);

  useEffect(() => {
    return () => {
      onChange?.(
        JSON.stringify({
          // eslint-disable-next-line react-hooks/exhaustive-deps
          index: indexRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          value: valueRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          keyword: keywordRef.current,
        } as IValue),
      );
      onScriptChange?.(make());
    };
  }, [indexRef, keywordRef, make, onChange, onScriptChange, valueRef]);

  const searchTimerId = useRef<number>(-1);

  useEffect(() => {
    clearTimeout(searchTimerId.current);
    searchTimerId.current = setTimeout(() => {
      const newList: string[] = [];
      const k = keyword.toLowerCase();
      source.forEach((s, index) => {
        if (`${s.id}` === k || s.name.toLowerCase().includes(k)) {
          newList.push(list[index]);
        }
      });
      setRenderingList(newList);
    }, 500) as unknown as number;
    return () => {
      clearTimeout(searchTimerId.current);
    };
  }, [keyword, list, source]);

  const reload = useCallback(() => {
    const maker = getRPGMaker();
    setSource(maker.getSwitchList());
    setList(maker.getSwitchList().map((i) => `${i.id}: ${i.name}`));
  }, [setList, setSource]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
    reload();
  }, [make, reload]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder="Search for name, id"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select value={index} onChange={(e) => setIndex(e.target.value)}>
        <option value="">-</option>
        {renderingList.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <div className={styles.row}>
        <input
          type="checkbox"
          placeholder="Current State (readonly)"
          readOnly
          checked={source[list.indexOf(index)]?.state || false}
        />
        <input
          type="checkbox"
          placeholder="Change State"
          step={1}
          checked={value}
          onChange={(e) => setValue(e.target.checked)}
        />
      </div>
      <div className={styles.row}>
        <button onClick={reload}>Reload</button>
        <button onClick={run}>Set</button>
      </div>
    </div>
  );
}
