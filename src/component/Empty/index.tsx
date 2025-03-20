import { PropsWithChildren, ReactElement } from "react";
import styles from "./style.module.scss";

export type IEmptyProps = object;

export default function Empty({
  children,
}: PropsWithChildren<IEmptyProps>): ReactElement {
  return <div className={styles.wrapper}>{children || "Empty"}</div>;
}
