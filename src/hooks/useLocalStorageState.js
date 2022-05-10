import { useEffect, useRef, useState } from "react";

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const valueInLocalStorage =
      typeof window !== "undefined" && window.localStorage.getItem(key);

    if (valueInLocalStorage) {
      try {
        return JSON.parse(valueInLocalStorage);
      } catch (error) {
        window.localStorage.removeItem(key);
      }
    }
    return typeof defaultValue === "function" ? defaultValue?.() : defaultValue;
  });

  const prevKeyRef = useRef(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorageState;
