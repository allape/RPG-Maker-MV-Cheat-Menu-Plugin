import { useStoredState } from "@allape/use-loading";
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { clone } from "./helper/";
import { IConfig, IFormula } from "./model/config.ts";
import Presets from "./presets.json";
import { getRPGMaker } from "./rpgmaker";
import styles from "./style.module.scss";
import Form from "./view/Form";
import Menu from "./view/Menu";

const DefaultConfig: IConfig = {
  formulas: [],
  appearance: {
    idlingOpacityLevel: 5,
    maxIdlingOpacityLevel: 5,
  },
};

export default function App(): ReactElement {
  const key = useMemo(
    () =>
      `${__APP_VERSION__}_RPG_MAKER_MV_CHEAT_MENU_PLUGIN_CONFIG_${getRPGMaker().getTitle()}`,
    [],
  );
  const dc = useMemo(() => clone<IConfig>(DefaultConfig), []);

  const configRef = useRef<IConfig>(dc);

  const [mode, setMode] = useState<"form" | "menu">("menu");
  const [config, setConfig] = useStoredState<IConfig>(key, dc);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const [value, setValue] = useState<IConfig>(config);

  const handleFormCancel = useCallback(() => {
    setMode("menu");
  }, []);

  const handleFormChange = useCallback(
    (c?: IConfig) => {
      if (!c) {
        return;
      }
      setConfig(c);
      handleFormCancel();
    },
    [handleFormCancel, setConfig],
  );

  const handleMenuCancel = useCallback(() => {
    setMode("form");
    setValue(clone(configRef.current));
  }, []);

  return (
    <div className={styles.wrapper}>
      {mode === "form" && (
        <Form
          presets={Presets as IFormula[]}
          value={value}
          onChange={handleFormChange}
          onCancel={handleFormCancel}
        />
      )}
      {mode === "menu" && <Menu config={config} onCancel={handleMenuCancel} />}
    </div>
  );
}
