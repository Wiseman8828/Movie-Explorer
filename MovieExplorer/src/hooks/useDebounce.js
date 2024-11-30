import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value.
 * @param {any} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {any} - The debounced value.
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const interval = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(interval)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce;
