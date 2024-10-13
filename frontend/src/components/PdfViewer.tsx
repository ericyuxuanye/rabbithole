import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

import { Button, Position, Tooltip } from "@react-pdf-viewer/core";
import {
  highlightPlugin,
  MessageIcon,
  RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";
import { v4 } from "uuid";
import { RHNodeData } from "../types/data";

interface PdfViewerProps {
  pdfUrl: string;
  trees: RHNodeData[];
  setTrees: (trees: RHNodeData[]) => void;
  setTreeIdx: (treeIdx: number) => void;
}

export default function PdfViewer({
  pdfUrl,
  trees,
  setTrees,
  setTreeIdx,
}: PdfViewerProps) {
  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <div
      style={{
        background: "#eee",
        display: "flex",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
        zIndex: "100",
      }}
      // onMouseDown={(e) => e.preventDefault()}
      // onMouseUp={(e) => e.preventDefault()}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button
            onClick={() => {
              // figure out how to get selected text
              const newTrees = [...trees];
              const treeIdx =
                newTrees.push({
                  name: "highlighted text",
                  uuid: v4(),
                  prompt: "Enter prompt",
                  response: "",
                  children: [],
                }) - 1;
              setTrees(newTrees);
              setTreeIdx(treeIdx);
            }}
          >
            <MessageIcon />
          </Button>
        }
        content={() => <div style={{ width: "100px" }}>Ask about this!</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
  });
  return (
    <div style={{ height: "100%" }}>
      <Worker
        workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}
      >
        <Viewer
          fileUrl={pdfUrl}
          plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
        />
      </Worker>
    </div>
  );
}
