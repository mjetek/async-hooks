import React, { useState, useEffect, useRef } from "react";

function useDelay(delay) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef(null);
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return show;
}

export function Spinner({ delay }) {
  const show = useDelay(delay);
  return show && <div>Loading</div>;
}
