import { useRef } from "react";
import _ from "@lodash";
import { ThrottleSettings } from "lodash";

const useThrottle = (
  func: (...args: unknown[]) => unknown,
  wait: number,
  options?: ThrottleSettings | undefined
) => {
  return useRef(_.throttle(func, wait, options)).current;
};

export default useThrottle;
