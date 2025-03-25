import { HTMLProps, ReactElement, useMemo } from "react";
import { getRPGMaker } from "../../rpgmaker";
import { IMap } from "../../rpgmaker/declare";

export interface IMapSelectorProps
  extends Omit<HTMLProps<HTMLSelectElement>, "value" | "onChange"> {
  value?: IMap["id"];
  onChange?: (value: IMap["id"]) => void;
}

export default function MapSelector({
  value,
  onChange,
  ...props
}: IMapSelectorProps): ReactElement {
  const maps = useMemo(() => getRPGMaker().getMapList(), []);
  return (
    <select
      {...props}
      value={value}
      onChange={(e) => onChange?.(+e.target.value)}
    >
      {maps.map((m) => (
        <option key={m.id} value={m.id}>
          {m.id}: {m.name}
        </option>
      ))}
    </select>
  );
}
