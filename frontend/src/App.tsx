import "./App.css";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(new Date());
  return (
    <>
      <p>Landing page is comming soon! {count.getUTCDate()}</p>
    </>
  );
}

export default App;
