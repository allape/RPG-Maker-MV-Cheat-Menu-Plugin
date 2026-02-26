import { useProxy } from "@allape/use-loading";
import { ReactElement, ReactNode, useCallback, useEffect } from "react";
import { getRPGMaker } from "../../../../rpgmaker";
import { NewScript } from "../../../../rpgmaker/script.ts";
import { ICheatModuleProps } from "../../declare";
import styles from "./style.module.scss";

export interface IProps extends ICheatModuleProps {
  fixedName?: string;
  buttonText?: ReactNode;
}

export default function OpenScene({
  value,
  onChange,
  onScriptChange,

  fixedName,
  buttonText,
}: IProps): ReactElement {
  const [v, vRef, setV] = useProxy<string>(fixedName || "");

  const make = useCallback(() => {
    if (!vRef.current) {
      return "";
    }
    return NewScript(`
      SceneManager.push(${vRef.current});
      SoundManager.playSystemSound(1);
    `);
  }, [vRef]);

  const run = useCallback(() => {
    getRPGMaker().evaluate(make());
  }, [make]);

  useEffect(() => {
    setV(fixedName || value || "");
  }, [fixedName, setV, value]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      onChange?.(vRef.current);
      onScriptChange?.(make());
    };
  }, [make, onChange, onScriptChange, vRef]);

  return (
    <div className={styles.wrapper}>
      {fixedName ? undefined : (
        <input
          type="text"
          placeholder="Scene Name"
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      )}

      <button onClick={run}>{buttonText || "Open"}</button>
    </div>
  );
}
