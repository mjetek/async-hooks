import React from "react";
import { useAsync2 } from "./Async";
import { Spinner } from "./Spinner";

let count = 0;
function incrementAsync() {
  return new Promise(resolve => setTimeout(() => resolve(++count), 600));
}

export default function AsyncTest() {
  const { run, pending, resolvedWith } = useAsync2();

  return (
    <>
      {pending ? <Spinner delay={300} /> : <div>{resolvedWith}</div>}
      <div>
        <button onClick={() => run(incrementAsync())}>Increment Async</button>
      </div>
    </>
  );
}
