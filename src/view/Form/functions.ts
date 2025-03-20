import { FunctionComponent } from "react";
import ChronusTimeHack from "../../component/module/chronus/ChronusTimeHack";
import { ICheatModuleProps } from "../../component/module/declare";
import DevTools from "../../component/module/DevTools";
import Gold from "../../component/module/Gold";
import HMTP from "../../component/module/HMTP";
import Item from "../../component/module/Item";
import Navigator from "../../component/module/Navigator";
import OptionSelect from "../../component/module/OptionSelect";
import Save from "../../component/module/Save";
import SaveInRoll from "../../component/module/SaveInRoll";
import Script from "../../component/module/Script";
import SpeedHack from "../../component/module/SpeedHack";
import Switch from "../../component/module/Switch";
import Variable from "../../component/module/Variable";

const functions = {
  ChronusTimeHack,
  DevTools,
  Gold,
  "HP | MP | TP": HMTP,
  Item,
  Navigator,
  OptionSelect,
  Save,
  SaveInRoll,
  Script,
  SpeedHack,
  Switch,
  Variable,
};

export type Types = keyof typeof functions;

export const Functions: Record<
  Types,
  FunctionComponent<ICheatModuleProps>
> = functions as unknown as Record<Types, FunctionComponent<ICheatModuleProps>>;
