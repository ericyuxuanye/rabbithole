import { useState } from "react";
import "./App.css";
import RHTree from "./components/RHTree";
import { v4 as uuidv4 } from "uuid";
import PdfViewer from "./components/PdfViewer";
import { RHNodeData } from "./types/data";
import Navbar from "./components/Navbar";

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Navbar />
        <PdfViewer
          pdfUrl="./test.pdf"
          trees={trees}
          setTrees={setTrees}
          setTreeIdx={setTreeIdx}
        />
      </div>
      {/* doesn't work in full screen */}
      {treeIdx != -1 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100vw",
            height: "45vh",
            borderTop: "1px solid black",
            background: "#ffffff",
            zIndex: "10",
            overflow: "hidden",
          }}
        >
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
