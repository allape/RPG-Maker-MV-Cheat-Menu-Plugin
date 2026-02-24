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
import { IItem, ItemType } from "../../../rpgmaker/declare";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  type: ItemType;
  keyword: string;
  item: string;
  amount: number;
}

export default function Item({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [type, typeRef, setType] = useProxy<IValue["type"]>("item");
  const [keyword, keywordRef, setKeyword] = useProxy<string>("");
  const [item, itemRef, setItem] = useProxy<IValue["item"]>("");
  const [amount, amountRef, setAmount] = useProxy<IValue["amount"]>(99);

  const [source, sourceRef, setSource] = useProxy<IItem[]>([]);
  const [list, listRef, setList] = useProxy<string[]>([]);
  const [renderingList, setRenderingList] = useState<string[]>([]);

  const make = useCallback(() => {
    const maker = getRPGMaker();
    const item = sourceRef.current[listRef.current.indexOf(itemRef.current)];
    if (!item) {
      return "";
    }
    return maker
      .getScriptGenerator()
      .gainItem(typeRef.current, item, amountRef.current);
  }, [amountRef, itemRef, listRef, sourceRef, typeRef]);

  useEffect(() => {
    if (!value) {
      return;
    }

    try {
      const v: IValue = JSON.parse(value);
      setType((o) => v.type || o);
      setKeyword((o) => v.keyword || o);
      setItem((o) => v.item || o);
      setAmount((o) => v.amount || o);
    } catch (e) {
      console.error(e);
    }
  }, [setAmount, setItem, setKeyword, setType, value]);

  useEffect(() => {
    return () => {
      onChange?.(
        JSON.stringify({
          type: typeRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          keyword: keywordRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          item: typeRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          amount: amountRef.current,
        } as IValue),
      );
      onScriptChange?.(make());
    };
  }, [amountRef, keywordRef, make, onChange, onScriptChange, typeRef]);

  const label = useMemo(() => {
    switch (type) {
      case "item":
        return "Item";
      case "weapon":
        return "Weapon";
      case "armor":
        return "Armor";
      default:
        return "Unknown";
    }
  }, [type]);

  const searchTimerId = useRef<number>(-1);

  useEffect(() => {
    clearTimeout(searchTimerId.current);
    searchTimerId.current = setTimeout(() => {
      const newList: string[] = [];
      const k = keyword.toLowerCase();
      source.forEach((s, index) => {
        if (
          `${s.id}` === k ||
          `${s.amount}` === k ||
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
    setSource(maker.getItemList(type));
    setList(maker.getItemList(type).map((i) => `${i.id}: ${i.name}`));
  }, [setList, setSource, type]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
    reload();
  }, [make, reload]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className={styles.wrapper}>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as ItemType)}
      >
        <option value="item">Item</option>
        <option value="weapon">Weapon</option>
        <option value="armor">Armor</option>
      </select>
      <input
        type="text"
        placeholder="Search for name, id, amount"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select value={item} onChange={(e) => setItem(e.target.value)}>
        <option value="">-</option>
        {renderingList.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Current Value (readonly)"
        readOnly
        value={source[list.indexOf(item)]?.amount || ""}
      />
      <input
        type="number"
        placeholder="Change Amount"
        step={1}
        value={amount}
        onChange={(e) => setAmount(+e.target.value)}
      />
      <div className={styles.row}>
        <button onClick={reload}>Reload</button>
        <button onClick={run}>
          {amount <= 0 ? "-" : "+"} {label}
        </button>
      </div>
    </div>
  );
}
