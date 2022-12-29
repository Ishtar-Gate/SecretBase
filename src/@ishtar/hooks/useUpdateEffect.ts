import { DependencyList, EffectCallback, useEffect, useRef } from "react";

const useUpdateEffect = (effect: EffectCallback, deps: DependencyList | undefined) => {
  const isInitialMount = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    isInitialMount.current
      ? () => {
          isInitialMount.current = false;
        }
      : effect,
    deps
  );
};

export default useUpdateEffect;
