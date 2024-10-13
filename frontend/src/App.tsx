import { useState } from "react";
import "./App.css";
import RHTree from "./components/RHTree";
import { v4 as uuidv4 } from 'uuid';
import RHNodeEditor from "./components/RHNodeEditor";


const treeData = {
  name: "root",
  uuid: uuidv4(),
  prompt: "hi",
  response: "hi",
  children: []
};

function App() {
  const [data, setData] = useState(treeData);

  return (
    <>
      <RHTree data={data} setData={setData} />
      {/* <RHNodeEditor rhNodeData={data} /> */}
    </>
  );
}

export default App;
