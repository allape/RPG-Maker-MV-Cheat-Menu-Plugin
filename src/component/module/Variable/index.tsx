import { useProxy } from "@allape/use-loading";
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { IVariable } from "../../../rpgmaker/declare";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  index: string;
  keyword: string;
  value: string;
}

export default function Variable({
  value: valueFromProps,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [index, indexRef, setIndex] = useProxy<IValue["index"]>("");
  const [keyword, keywordRef, setKeyword] = useProxy<IValue["keyword"]>("");
  const [value, valueRef, setValue] = useProxy<IValue["value"]>("");

  const [source, sourceRef, setSource] = useProxy<IVariable[]>([]);
  const [list, listRef, setList] = useProxy<string[]>([]);
  const [renderingList, setRenderingList] = useState<string[]>([]);

  const make = useCallback(() => {
    const maker = getRPGMaker();
    const v = sourceRef.current[listRef.current.indexOf(indexRef.current)];
    if (!v) {
      return "";
    }
    return maker.getScriptGenerator().setVariable(v, valueRef.current);
  }, [indexRef, listRef, sourceRef, valueRef]);

  useEffect(() => {
    if (!valueFromProps) {
      return;
    }

    try {
      const v: IValue = JSON.parse(valueFromProps);
      setIndex((o) => v.index || o);
      setKeyword((o) => v.keyword || o);
      setValue((o) => v.value || o);
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
          keyword: keywordRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          value: valueRef.current,
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
        if (
          `${s.id}` === k ||
          `${s.value}`.toLowerCase().includes(k) ||
          s.name.toLowerCase().includes(k)
        ) {
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
    const vars = maker.getVariableList();
    setSource(vars);
    setList(vars.map((i) => `${i.id}: ${i.name}`));
  }, [setList, setSource]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
    reload();
  }, [make, reload]);

  useEffect(() => {
    reload();
  }, [reload]);

  const currentIndex = useMemo(() => {
    return [index];
  }, [index]);

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder="Search for id, name, value"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select
        value={currentIndex}
        onChange={(e) => setIndex(e.target.value)}
        multiple
        size={5}
      >
        <option value="">-</option>
        {renderingList.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <textarea
        rows={5}
        placeholder="Current Value (readonly)"
        readOnly
        value={`${source[list.indexOf(index)]?.value ?? ""}`}
      />
      <textarea
        rows={5}
        placeholder="Change Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className={styles.row}>
        <button onClick={reload}>Reload</button>
        <button onClick={run}>Set</button>
      </div>
    </div>
  );
}
