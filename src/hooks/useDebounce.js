import { useState, useEffect } from 'react';

// Waits for the user to stop changing a value before returning it.
// Useful for search inputs — avoids firing an API call on every keystroke.
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
