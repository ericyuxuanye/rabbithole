import { useState } from "react";
import "./App.css";
import RHTree from "./components/RHTree";
import { RHNodeData } from "./components/RHTree";
import { v4 as uuidv4 } from 'uuid';


const treeData: RHNodeData = {
  name: "1",
  uuid: uuidv4(),
  prompt: "hi",
  response: "hi",
  children: [
    {
      name: "2",
      uuid: uuidv4(),
      prompt: "hi",
      response: "hi",
      children: [],
    },
    {
      name: "3",
      uuid: uuidv4(),
      prompt: "hi",
      response: "hi",
      children: [],
    },
  ],
};

function App() {
  const [data, setData] = useState(treeData);

  return (
    <>
      <RHTree data={data} setData={setData} />
    </>
  );
}

export default App;
