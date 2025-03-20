import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../rpgmaker";
import { NewScript } from "../../../rpgmaker/script.ts";
import { ICheatModuleProps } from "../declare";
import styles from "./style.module.scss";

interface IValue {
  index: number;
  sceneWindowName: string;
}

export default function OptionSelect({
  value,
  onChange,
  onScriptChange,
}: ICheatModuleProps): ReactElement {
  const [index, indexRef, setIndex] = useProxy<IValue["index"]>(0);
  const [sceneWindowName, sceneWindowNameRef, setSceneWindowName] = useProxy<
    IValue["sceneWindowName"] | undefined
  >(undefined);

  const make = useCallback(() => {
    // language=JavaScript
    return NewScript(`
      if (!window.SceneManager) return;

      var scene = SceneManager._scene;
      if (!scene) return;

      var windowName = decodeURIComponent('${encodeURIComponent(sceneWindowNameRef.current || "")}');

      if (windowName) {
        scene = scene[windowName];
        if (!scene) return;
      }

      if (!(scene instanceof Window_Selectable)) {
        var found = Object.entries(scene).reverse().find(([name, value]) => value instanceof Window_Selectable && value.visible);
        scene = found[1];
      }

      if (!scene) return;

      var index = parseInt('${indexRef.current}');
      if (isNaN(index) || index < 0) {
        alert('Invalid index');
      }

      scene._index = parseInt('${indexRef.current}');
      scene.processOk();
    `);
  }, [indexRef, sceneWindowNameRef]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  useEffect(() => {
    if (!value) {
      return;
    }
    try {
      const v: IValue = JSON.parse(value);
      setIndex((o) => v.index || o);
      setSceneWindowName((o) => v.sceneWindowName || o);
    } catch (e) {
      console.error(e);
    }
  }, [setIndex, setSceneWindowName, value]);

  useEffect(() => {
    return () => {
      onChange?.(
        JSON.stringify({
          // eslint-disable-next-line react-hooks/exhaustive-deps
          index: indexRef.current,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          sceneWindowName: sceneWindowNameRef.current,
        } as IValue),
      );
      onScriptChange?.(make());
    };
  }, [indexRef, make, onChange, onScriptChange, sceneWindowNameRef]);

  return (
    <div className={styles.wrapper}>
      <input
        type="number"
        placeholder="Option Index"
        value={index}
        step={1}
        min={0}
        onChange={(e) => setIndex(+e.target.value)}
      />
      <input
        type="text"
        placeholder="Scene Window Name (Optinal)"
        value={sceneWindowName}
        onChange={(e) => setSceneWindowName(e.target.value)}
      />
      <button onClick={run}>Select And Ok</button>
    </div>
  );
}
