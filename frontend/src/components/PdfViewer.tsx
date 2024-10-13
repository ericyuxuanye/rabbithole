import SearchIcon from "@mui/icons-material/Search";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

import { Button, Position, Tooltip } from "@react-pdf-viewer/core";
import {
  highlightPlugin,
  RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";
import { v4 } from "uuid";
import { RHNodeData } from "../types/data";

interface PdfViewerProps {
  pdfUrl: string;
  trees: RHNodeData[];
  setTrees: (trees: RHNodeData[]) => void;
  setTreeIdx: (treeIdx: number) => void;
  setFocusedUuid: (focusedUuid: string) => void;
}

export default function PdfViewer({
  pdfUrl,
  trees,
  setTrees,
  setTreeIdx,
  setFocusedUuid,
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
              const selectedString = window.getSelection()?.toString();
              const treeIdx =
                newTrees.push({
                  name: `${
                    selectedString!.length > 0
                      ? selectedString
                      : "Query description"
                  }`,
                  uuid: v4(),
                  prompt: "Enter prompt",
                  response: "",
                  prompts: [],
                  responses: [],
                  children: [],
                }) - 1;
              setTrees(newTrees);
              setTreeIdx(treeIdx);
              setFocusedUuid(newTrees[newTrees.length - 1].uuid);
            }}
          >
            <div style={{ marginTop: "0.25rem" }}>
              <SearchIcon />
            </div>
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
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
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
