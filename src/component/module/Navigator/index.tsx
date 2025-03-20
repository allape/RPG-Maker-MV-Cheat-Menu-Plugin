import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { IMap } from "../../../rpgmaker/declare";
import MapSelector from "../../MapSelector";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  mapId: number;
  x: number;
  y: number;
}

export default function Navigator({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [mapId, mapIdRef, setMapId] = useProxy<IValue["mapId"]>(-1);
  const [x, xRef, setX] = useProxy<IValue["x"]>(0);
  const [y, yRef, setY] = useProxy<IValue["y"]>(0);

  const [current, setCurrent] = useState<IValue>();

  const [maps, mapsRef, setMaps] = useProxy<IMap[]>([]);

  const make = useCallback(() => {
    const map = mapsRef.current.find((i) => i.id === mapIdRef.current);
    if (!map) {
      return "";
    }
    return getRPGMaker()
      .getScriptGenerator()
      .teleport(map, xRef.current, yRef.current);
  }, [mapIdRef, mapsRef, xRef, yRef]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  useEffect(() => {
    if (!value) {
      return;
    }
    try {
      const v: IValue = JSON.parse(value);
      setMapId((o) => v.mapId || o);
      setX((o) => v.x || o);
      setY((o) => v.y || o);
    } catch (e) {
      console.error(e);
    }
  }, [setMapId, setX, setY, value]);

  useEffect(() => {
    return () => {
      onChange?.(
        JSON.stringify({
          // eslint-disable-next-line react-hooks/exhaustive-deps
          mapId: mapIdRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          x: xRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          y: yRef.current,
        } as IValue),
      );
      onScriptChange?.(make());
    };
  }, [make, mapIdRef, onChange, onScriptChange, xRef, yRef]);

  useEffect(() => {
    setMaps(getRPGMaker().getMapList);
  }, [setMaps]);

  const reload = useCallback(() => {
    const map = getRPGMaker().getCurrentMap();
    const actor = getRPGMaker().getHero();
    if (!map || !actor) {
      setCurrent(undefined);
      return;
    }
    setCurrent({
      mapId: map.id,
      x: actor.x,
      y: actor.y,
    });
  }, []);

  useEffect(() => {
    reload();

    const id = setInterval(reload, 1000);
    return () => clearInterval(id);
  }, [reload]);

  return (
    <div className={styles.wrapper}>
      <input
        readOnly
        value={`Current: ${(current?.mapId ? maps[current.mapId]?.name : undefined) || "-"}`}
      />
      <div className={styles.row}>
        <input readOnly placeholder="X" value={current?.x || "-"} />
        <input readOnly placeholder="Y" value={current?.y || "-"} />
      </div>
      <MapSelector value={mapId} onChange={setMapId} />
      <div className={styles.row}>
        <input
          type="number"
          placeholder="X"
          value={x}
          onChange={(e) => setX(+e.target.value)}
        />
        <input
          type="number"
          placeholder="Y"
          value={y}
          onChange={(e) => setY(+e.target.value)}
        />
      </div>
      <button onClick={run}>Teleport Now</button>
    </div>
  );
}
