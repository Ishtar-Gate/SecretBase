import React, { Suspense } from "react";
import Loading, { LoadingProps } from "@ishtar/core/Loading";

export interface SuspenseProps {
  delay?: LoadingProps["delay"];
}

/**
 * React Suspense defaults
 * For to Avoid Repetition
 */
const DefaultSuspense: React.FC<React.PropsWithChildren<SuspenseProps>> = ({ delay, children }) => (
  <Suspense fallback={<Loading delay={delay} />}>{children}</Suspense>
);

export default DefaultSuspense;
