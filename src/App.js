import React, { useState } from "react";
import "./App.css";
import AsyncTest from "./AsyncTest";

function App() {
  const [showAsync, setShowAsync] = useState(true);

  return (
    <div className="App">
      <header className="App-header">
        {showAsync && <AsyncTest />}
        <button onClick={() => setShowAsync(show => !show)}>Toggle</button>
      </header>
    </div>
  );
}

export default App;
