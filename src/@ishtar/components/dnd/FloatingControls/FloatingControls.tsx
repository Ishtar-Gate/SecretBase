import React from 'react';
import clsx from 'clsx';

import styles from './FloatingControls.module.css';

export interface Props {
  children: React.ReactNode;
}

export function FloatingControls({children}: Props) {
  return <div className={clsx(styles.FloatingControls)}>{children}</div>;
}
