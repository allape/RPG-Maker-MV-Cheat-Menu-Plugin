import { useProxy } from "@allape/use-loading";
import cls from "classnames";
import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Empty from "../../component/Empty";
import { clone, id, newID } from "../../helper/";
import { IAction, IConfig, IFormula, ITrigger } from "../../model/config.ts";
import { getRPGMaker } from "../../rpgmaker";
import ArrayDifferButton from "./component/ArrayDifferButton";
import KeyBinder from "./component/KeyBinder";
import Section from "./component/Section";
import { FunctionKeys, Functions, Types } from "./functions.ts";
import styles from "./style.module.scss";

export interface IFormProps {
  presets?: IFormula[];
  value?: IConfig;
  onChange?: (value?: IConfig) => void;
  onCancel?: () => void;
}

export default function Form({
  presets,
  value,
  onChange,
  onCancel,
}: IFormProps): ReactElement {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [config, configRef, _setConfig] = useProxy<IConfig | undefined>(
    undefined,
  );
  const [formulas, formulasRef, setFormulas] = useProxy<IFormula[]>([]);

  const [formula, formulaRef, setFormula] = useProxy<IFormula | undefined>(
    undefined,
  );
  const [trigger, triggerRef, setTrigger] = useProxy<ITrigger | undefined>(
    undefined,
  );

  const selectFormula = useCallback(
    (f: IFormula | undefined) => {
      setFormula(f);
      setTrigger(f?.triggers[0]);
    },
    [setFormula, setTrigger],
  );

  const setConfig = useCallback(
    (config?: IConfig) => {
      _setConfig(config);

      const fs = config?.formulas || [];
      setFormulas(fs);
      selectFormula(fs.find((i) => i.id === config?.activeFormula) || fs[0]);
    },
    [_setConfig, selectFormula, setFormulas],
  );

  useEffect(() => {
    setConfig(value);
  }, [setConfig, value]);

  const reload = useCallback(() => {
    setFormulas((old) => [...old]);
  }, [setFormulas]);

  const addFormula = useCallback(
    (preset?: IFormula) => {
      const nf: IFormula = preset
        ? newID([clone(preset)])[0]
        : {
            id: id("formula"),
            name: `New ${formulasRef.current.length}`,
            triggers: [],
          };
      setFormulas((fs) => [nf, ...fs]);
      selectFormula(nf);
    },
    [formulasRef, selectFormula, setFormulas],
  );

  const removeFormula = useCallback(
    (f: IFormula) => {
      const fs = formulasRef.current;
      const index = fs.indexOf(f);

      if (index === -1) {
        return;
      }

      fs.splice(index, 1);

      selectFormula(fs[index] || fs[0]);

      setFormulas([...fs]);
    },
    [formulasRef, selectFormula, setFormulas],
  );

  const selectTrigger = useCallback(
    (t: ITrigger | undefined) => {
      setTrigger(t);

      if (!t) {
        return;
      }

      // const ele = document.querySelector(`[data-id="${t.id}"]`);
      // if (!ele) {
      //   return;
      // }
      // ele.scrollIntoView({
      //   block: "center",
      // });
    },
    [setTrigger],
  );

  const handleMoveTrigger = useCallback(
    (t: ITrigger, diff: number) => {
      const f = formulaRef.current;
      if (!f) {
        return;
      }

      const triggers = f.triggers;

      const from = triggers.indexOf(t);
      if (from === -1) {
        return;
      }

      let to = from + diff;
      if (to < 0) {
        to = 0;
      } else if (to >= triggers.length) {
        to = triggers.length - 1;
      }

      if (to === 0 || to === triggers.length - 1) {
        const [temp] = triggers.splice(from, 1);
        if (to === 0) {
          f.triggers = [temp, ...triggers];
        } else {
          f.triggers = [...triggers, temp];
        }
      } else {
        const temp = triggers[from];
        triggers[from] = triggers[to];
        triggers[to] = temp;
        f.triggers = [...triggers];
      }

      reload();
    },
    [formulaRef, reload],
  );

  const handleRemoveTrigger = useCallback(
    (t: ITrigger) => {
      const f = formulaRef.current;

      if (!f) {
        return;
      }

      const index = f.triggers.indexOf(t);
      if (index === -1) {
        return;
      }

      f.triggers.splice(index, 1);

      setTrigger(f.triggers[index] || f.triggers[0]);

      reload();
    },
    [formulaRef, reload, setTrigger],
  );

  const addTrigger = useCallback(() => {
    if (!formulaRef.current) {
      return;
    }

    const newTrigger: ITrigger = {
      id: id("trigger"),
      name: `New ${formulaRef.current?.triggers.length}`,
      actions: [],
    };

    formulaRef.current.triggers = [newTrigger, ...formulaRef.current.triggers];

    setTrigger(newTrigger);
  }, [formulaRef, setTrigger]);

  const addAction = useCallback(
    (type: Types) => {
      if (!type || !triggerRef.current) {
        return;
      }

      const newAction: IAction = {
        id: id("action"),
        type,
        value: "",
        script: "",
      };

      triggerRef.current.actions = [newAction, ...triggerRef.current.actions];
      reload();
    },
    [reload, triggerRef],
  );

  const handleRemoveAction = useCallback(
    (a: IAction) => {
      const trigger = triggerRef.current;
      if (!trigger) {
        return;
      }

      const index = trigger.actions.indexOf(a);
      if (index === -1) {
        return;
      }

      trigger.actions.splice(index, 1);
      reload();
    },
    [reload, triggerRef],
  );

  const handleOk = useCallback(
    (saveAsJSON: boolean = false) => {
      const c = {
        ...configRef.current,
        formulas: formulasRef.current,
      } as IConfig;

      if (saveAsJSON) {
        const json = JSON.stringify(c, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "config.json";
        a.click();
        return;
      }

      onChange?.(c);
    },
    [configRef, formulasRef, onChange],
  );

  const handleImport = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) {
        return;
      }

      const file = e.target.files[0];
      const json = JSON.parse(await file.text());
      setConfig(json);
    },
    [setConfig],
  );

  const [functionKeyword, setFunctionKeyword] = useState<string>("");

  const triggers = formulas.flatMap((formula) => formula.triggers);
  const actions = triggers.flatMap((trigger) => trigger.actions);

  const visibleTriggers = formula?.triggers || [];
  const visibleActions = trigger?.actions || [];

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttons}>
        <button onClick={() => handleOk()}>Okay</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
      <div className={styles.sections}>
        <Section
          title="Formulas"
          action={<button onClick={() => addFormula()}>+</button>}
        >
          {presets?.map((p, pi) => (
            <div
              key={pi}
              className={cls(styles.formula, styles.preset)}
              onClick={() => addFormula(p)}
            >
              {p.name}
            </div>
          ))}
          {presets?.length && <hr />}
          {formulas.map((f) => (
            <div
              key={f.id}
              className={cls(styles.formula, f === formula && styles.current)}
              onClick={() => {
                selectFormula(f);
              }}
            >
              <input
                type="text"
                value={f.name}
                onChange={(e) => {
                  f.name = e.target.value;
                  reload();
                }}
              />
              <button
                className={styles.delete}
                onClickCapture={() => removeFormula(f)}
              >
                -
              </button>
            </div>
          ))}
          {!formulas.length && <Empty />}
        </Section>
        <Section
          title="Triggers"
          action={
            <button disabled={!formula} onClick={addTrigger}>
              +
            </button>
          }
        >
          {triggers.map((t) => (
            <div
              key={t.id}
              data-id={t.id}
              className={cls(
                styles.trigger,
                visibleTriggers.includes(t) && styles.visible,
                trigger === t && styles.current,
              )}
              onClick={() => {
                selectTrigger(t);
              }}
            >
              <textarea
                rows={5}
                value={t.name}
                onChange={(e) => {
                  t.name = e.target.value;
                  reload();
                }}
              ></textarea>
              <div className={styles.controls}>
                <KeyBinder
                  value={t.hotKey}
                  onChange={(key) => {
                    t.hotKey = key;
                    reload();
                  }}
                />
              </div>
              <div className={styles.controls}>
                <button
                  onClick={() => handleMoveTrigger(t, -visibleTriggers.length)}
                >
                  ⤒
                </button>
                <button onClick={() => handleMoveTrigger(t, -1)}>↑</button>
                <button
                  className={styles.delete}
                  onClickCapture={() => handleRemoveTrigger(t)}
                >
                  -
                </button>
                <button onClick={() => handleMoveTrigger(t, 1)}>↓</button>
                <button
                  onClick={() => handleMoveTrigger(t, visibleTriggers.length)}
                >
                  ⤓
                </button>
              </div>
            </div>
          ))}
          {!visibleTriggers.length && <Empty />}
        </Section>
        <Section title="Actions">
          {actions.map((a) => {
            const Comp = Functions[a.type as Types];
            return (
              <div
                key={a.id}
                className={cls(
                  styles.action,
                  visibleActions.includes(a) && styles.visible,
                )}
              >
                <div className={styles.title}>
                  <span>{a.type}</span>
                  <button
                    className={cls(styles.button, styles.delete)}
                    onClickCapture={() => handleRemoveAction(a)}
                  >
                    -
                  </button>
                </div>
                {Comp ? (
                  <Comp
                    value={a.value}
                    onChange={(v) => (a.value = v)}
                    onScriptChange={(s) => (a.script = s)}
                  />
                ) : (
                  <Empty>Unable to Render</Empty>
                )}
              </div>
            );
          })}
          {!visibleActions.length && <Empty />}
        </Section>
        <Section
          title={
            <input
              style={{ height: "100%", flex: "1" }}
              type="search"
              placeholder="Functions: Search by Name"
              value={functionKeyword}
              onChange={(e) => setFunctionKeyword(e.target.value)}
            />
          }
        >
          {FunctionKeys.filter((name) =>
            name.toLowerCase().includes(functionKeyword),
          ).map((name) => (
            <div
              key={name}
              className={cls(styles.function, trigger && styles.hasTrigger)}
              onClick={() => addAction(name as Types)}
            >
              {name}
            </div>
          ))}
        </Section>
      </div>
      <div className={styles.settings}>
        <div className={styles.row}>
          <div className={styles.idleOpacity}>
            <label>Idle Opacity:</label>
            <input
              type="range"
              min={0}
              max={config?.appearance.maxIdlingOpacityLevel}
              value={config?.appearance.idlingOpacityLevel || 0}
              onChange={(e) => {
                if (!config) {
                  return;
                }
                config.appearance.idlingOpacityLevel = +e.target.value;
                _setConfig((old) => (old ? { ...old } : old));
              }}
            />
          </div>
          <div className={styles.buttons}>
            <ArrayDifferButton />
            <button onClick={handleImport}>Import</button>
            <button onClick={() => handleOk(true)}>Export</button>
          </div>
        </div>
        <div className={styles.versions}>
          {__APP_VERSION__}, {getRPGMaker().getVersionString()}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        className={styles.file}
        onChange={handleFileChange}
      />
    </div>
  );
}
