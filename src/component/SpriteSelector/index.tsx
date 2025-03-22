import { ReactElement, useMemo } from "react";
import { getRPGMaker } from "../../rpgmaker";
import { IActor, TeamType } from "../../rpgmaker/declare";

export type Value = IActor["id"] | "all" | "alive";

export interface ISpriteSelectorProps {
  teamType: TeamType;
  value?: Value;
  onChange?: (value: Value) => void;
  all?: boolean;
  alive?: boolean;
}

export default function SpriteSelector({
  all,
  alive,
  teamType,
  value,
  onChange,
}: ISpriteSelectorProps): ReactElement {
  const actors = useMemo(() => {
    if (teamType === "alias") {
      return getRPGMaker().getAliasList();
    }
    return getRPGMaker().getEnemyList();
  }, [teamType]);

  const label = useMemo(
    () => (teamType === "alias" ? "Aliases" : "Enemies"),
    [teamType],
  );

  return (
    <select value={value} onChange={(e) => onChange?.(e.target.value as Value)}>
      {all && <option value="all">All {label}</option>}
      {alive && <option value="alive">Alive {label}</option>}
      <option value={-1}>-</option>
      {actors.map((a, i) => (
        <option key={i} value={`${a.id}`}>
          {a.name}
        </option>
      ))}
    </select>
  );
}
