import { useProxy } from "@allape/use-loading";
import { ReactElement, useCallback, useEffect, useState } from "react";
import Empty from "../../component/Empty";
import { IConfig, IFormula, ITrigger } from "../../model/config.ts";
import { getRPGMaker } from "../../rpgmaker";
import styles from "./style.module.scss";

export interface IMenuProps {
  onCancel?: () => void;
  config: IConfig;
}

export default function Menu({ config, onCancel }: IMenuProps): ReactElement {
  const [active, setActive] = useState<IFormula["id"]>();
  const [formula, formulaRef, setFormula] = useProxy<IFormula | undefined>(
    undefined,
  );

  useEffect(() => {
    if (active) {
      setFormula(config.formulas.find((f) => f.id === active));
    } else {
      setFormula(undefined);
    }
  }, [active, config.formulas, setFormula]);

  useEffect(() => {
    setActive(
      config.formulas.find((f) => f.id === config.activeFormula)?.id ||
        config.formulas[0]?.id,
    );
  }, [config.activeFormula, config.formulas]);

  const runTrigger = useCallback((t: ITrigger) => {
    t.actions.forEach((a) => {
      getRPGMaker().evaluate(a.script);
    });
  }, []);

  useEffect(() => {
    let timer = -1;
    let highlighted: ITrigger["id"][] = [];

    const handleKeyUp = (e: KeyboardEvent) => {
      clearTimeout(timer);

      const triggers = (formulaRef.current?.triggers || []).filter(
        (t) => t.hotKey === e.key,
      );
      highlighted.push(...triggers.map((t) => t.id));

      triggers.forEach((t) => {
        const ele = document.querySelector(`[data-id=${t.id}]`) as HTMLElement;
        if (ele) {
          ele.style.opacity = "1";
        }
        runTrigger(t);
      });

      timer = setTimeout(() => {
        highlighted.forEach((id) => {
          const ele = document.querySelector(`[data-id=${id}]`) as HTMLElement;
          if (ele) {
            ele.style.opacity = "";
          }
        });
        highlighted = [];
      }, 100) as unknown as number;
    };
    window.addEventListener("keyup", handleKeyUp, true);
    return () => {
      window.removeEventListener("keyup", handleKeyUp, true);
      clearTimeout(timer);
    };
  }, [formulaRef, runTrigger]);

  return (
    <div
      className={styles.wrapper}
      style={{
        opacity:
          config.appearance.idlingOpacityLevel /
          config.appearance.maxIdlingOpacityLevel,
      }}
    >
      <div className={styles.form} onClick={onCancel}>
        Edit
      </div>
      <select value={active} onChange={(e) => setActive(e.target.value)}>
        {config.formulas.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      {!formula && <Empty />}
      <div className={styles.triggers}>
        {formula?.triggers.map((t) => (
          <div
            key={t.id}
            className={styles.trigger}
            data-id={t.id}
            onClick={() => runTrigger(t)}
          >
            {t.name ? (
              <div dangerouslySetInnerHTML={{ __html: t.name }} />
            ) : (
              "???"
            )}
            {t.hotKey && <div>[ {t.hotKey} ]</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
