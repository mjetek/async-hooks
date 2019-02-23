import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect
} from "react";

function makeCancelable(promise) {
  let canceled = false;
  return {
    promise: new Promise(async (resolve, reject) => {
      try {
        const result = await promise;
        if (canceled) {
          reject({ canceled });
        }
        resolve(result);
      } catch (reason) {
        if (canceled) {
          reject({ canceled });
        }
        reject(reason);
      }
    }),
    cancel: () => {
      canceled = true;
    }
  };
}

const AsyncContext = createContext({
  pending: false,
  setPending: () => {},
  resolved: false,
  setResolved: () => {},
  rejected: false,
  setRejected: () => {}
});

export function AsyncProvider({ children, fallback }) {
  const [pending, setPending] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [rejected, setRejected] = useState(false);

  return (
    <AsyncContext.Provider
      value={{
        pending,
        setPending,
        resolved,
        setResolved,
        rejected,
        setRejected
      }}
    >
      <Async fallback={fallback}>{children}</Async>
    </AsyncContext.Provider>
  );
}

export function useAsync() {
  const { setPending, setResolved, setRejected } = useContext(AsyncContext);

  const promiseRef = useRef(null);

  return async function runAsync(promise) {
    try {
      setPending(true);
      if (promiseRef.current != null) {
        promiseRef.current.cancel();
      }
      promiseRef.current = makeCancelable(promise);
      const response = await promiseRef.current.promise;
      setPending(false);
      setResolved(true);
      return response;
    } catch (reason) {
      if (reason.canceled) {
        throw reason;
      }
      setRejected(true);
      throw reason;
    }
  };
}

function Async({ fallback, children }) {
  const { pending } = useContext(AsyncContext);
  return (
    <>
      {pending && fallback}
      <div style={{ display: pending && fallback ? "none" : null }}>
        {children}
      </div>
    </>
  );
}

export function useAsync2() {
  const promiseRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [resolvedWith, setResolvedWith] = useState(null);
  const [rejectedWith, setRejectedWith] = useState(null);

  useEffect(() => {
    return () => {
      console.log("cleanup");
      if (promiseRef.current != null) {
        promiseRef.current.cancel();
      }
    };
  }, []);

  async function run(promise) {
    if (promiseRef.current != null) {
      promiseRef.current.cancel();
    }
    promiseRef.current = makeCancelable(promise);
    try {
      setPending(true);
      const response = await promiseRef.current.promise;
      setResolvedWith(response);
      setPending(false);
      return response;
    } catch (reason) {
      if (reason.canceled) {
        return;
      }
      setRejectedWith(reason);
      setPending(false);
      throw reason;
    }
  }

  return { run, pending, resolvedWith, rejectedWith };
}
