import { ReactElement } from "react";
import { ICheatModuleProps } from "../../declare";
import OpenScene from "../OpenScene";

export default function ItemMenu(props: ICheatModuleProps): ReactElement {
  return <OpenScene {...props} fixedName="Scene_Item" />;
}
