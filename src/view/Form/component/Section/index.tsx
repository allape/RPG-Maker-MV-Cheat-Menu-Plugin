import { PropsWithChildren, ReactElement, ReactNode } from "react";
import styles from "./style.module.scss";

export interface ISectionProps {
  title?: ReactNode;
  action?: ReactNode;
}

export default function Section({
  title,
  action,
  children,
}: PropsWithChildren<ISectionProps>): ReactElement {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div className={styles.text}>{title}</div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      <div className={styles.slot}>{children}</div>
    </div>
  );
}
