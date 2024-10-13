import { useState } from "react";
import "./App.css";
import RHTree from "./components/RHTree";
import { v4 as uuidv4 } from "uuid";
import PdfViewer from "./components/PdfViewer";

const treeData = {
  name: "root",
  uuid: uuidv4(),
  prompt: "hi",
  response: "hi",
  children: [],
};

function App() {
  const [data, setData] = useState(treeData);

  return (
    <>
      {/* <RHTree data={data} setData={setData} /> */}
      <div
        style={{
          // position: "absolute",
          // left: 0,
          // top: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <PdfViewer pdfUrl="./test.pdf" />
      </div>
    </>
  );
}

export default App;
