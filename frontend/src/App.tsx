import { useState } from "react";
import "./App.css";
import RHTree from "./components/RHTree";
import { v4 as uuidv4 } from "uuid";
import PdfViewer from "./components/PdfViewer";
import { RHNodeData } from "./types/data";

const treeData = {
  name: "root",
  uuid: uuidv4(),
  prompt: "hi",
  response: "hi",
  children: [],
};

function App() {
  const [trees, setTrees] = useState<RHNodeData[]>([]);
  const [treeIdx, setTreeIdx] = useState(-1);

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
        <PdfViewer
          pdfUrl="./test.pdf"
          trees={trees}
          setTrees={setTrees}
          setTreeIdx={setTreeIdx}
        />
      </div>
      {/* doesn't work in full screen */}
      {treeIdx != -1 && (
        <div style={{
          position: "absolute",
          bottom: 0,
          width: "100vw",
          height: "50vh",
          borderTop: "1px solid black",
          background: "#ffffff"
        }}>
          <RHTree
            data={trees[treeIdx]}
            setData={(value: RHNodeData) => {
              const newTrees = [...trees];
              newTrees[treeIdx] = value;
              setTrees(newTrees);
            }}
          />
        </div>
      )}
    </>
  );
}

export default App;
