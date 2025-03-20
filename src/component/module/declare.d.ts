import { Script } from "../../rpgmaker/declare";

export interface ICheatModuleProps {
  value?: string;
  onChange?: (value: string) => void;
  onScriptChange?: (value: Script) => void;
}
