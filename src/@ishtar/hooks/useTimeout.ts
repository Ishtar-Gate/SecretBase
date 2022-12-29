import { useEffect, useRef } from "react";

function useTimeout(callback: () => void, delay: number | false) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (delay && callback && typeof callback === "function") {
      timer = setTimeout(callbackRef.current, delay || 0);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [callback, delay]);
}

export default useTimeout;
