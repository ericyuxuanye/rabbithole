import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import PdfViewer from "./components/PdfViewer";
import RHTree from "./components/RHTree";
import { RHNodeData } from "./types/data";

function App() {
  const [trees, setTrees] = useState<RHNodeData[]>([]);
  const [treeIdx, setTreeIdx] = useState(-1);
  // display the editor for the root initially
  const [focusedUuid, setFocusedUuid] = useState("");

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
        <Navbar trees={trees} setTreeIdx={setTreeIdx} />
        <PdfViewer
          pdfUrl="./test.pdf"
          trees={trees}
          setTrees={setTrees}
          setTreeIdx={setTreeIdx}
          setFocusedUuid={setFocusedUuid}
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
          <Button
            variant="contained"
            color="error" // Use MUI's predefined red color
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: "20", // Ensure button is above overlay
              minWidth: "40px", // Set minimum width to make it round
              minHeight: "40px", // Set minimum height to make it round
              borderRadius: "50%", // Make the button round
              padding: "8px", // Add padding for icon size
            }}
            onClick={() => {
              setTreeIdx(-1);
            }}
          >
            <CloseIcon />
          </Button>
          <RHTree
            data={trees[treeIdx]}
            setData={(value: RHNodeData) => {
              const newTrees = [...trees];
              newTrees[treeIdx] = value;
              setTrees(newTrees);
            }}
            focusedUuid={focusedUuid}
            setFocusedUuid={setFocusedUuid}
          />
        </div>
      )}
    </>
  );
}

export default App;
