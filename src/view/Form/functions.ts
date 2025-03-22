import { FunctionComponent } from "react";
import ChronusTimeHack from "../../component/module/chronus/ChronusTimeHack";
import ClearState from "../../component/module/ClearState";
import { ICheatModuleProps } from "../../component/module/declare";
import DevTools from "../../component/module/DevTools";
import Exp from "../../component/module/Exp";
import Gold from "../../component/module/Gold";
import HMTP from "../../component/module/HMTP";
import Item from "../../component/module/Item";
import Navigator from "../../component/module/Navigator";
import OptionSelect from "../../component/module/OptionSelect";
import Save from "../../component/module/Save";
import SaveInRoll from "../../component/module/SaveInRoll";
import Script from "../../component/module/Script";
import SpeedHack from "../../component/module/SpeedHack";
import Status from "../../component/module/Status";
import Switch from "../../component/module/Switch";
import Variable from "../../component/module/Variable";

const functions = {
  ChronusTimeHack,
  ClearState,
  DevTools,
  Exp,
  Gold,
  "HP | MP | TP": HMTP,
  Item,
  Navigator,
  OptionSelect,
  Save,
  SaveInRoll,
  Script,
  SpeedHack,
  Status,
  Switch,
  Variable,
};

export type Types = keyof typeof functions;

export const Functions: Record<
  Types,
  FunctionComponent<ICheatModuleProps>
> = functions as unknown as Record<Types, FunctionComponent<ICheatModuleProps>>;

export const FunctionKeys = Object.keys(functions).sort((a, b) =>
  a.localeCompare(b),
) as Types[];
