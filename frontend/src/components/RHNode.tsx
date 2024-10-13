import { useState } from "react";
import { TreeNodeDatum } from "react-d3-tree";
import { RHNodeData } from "../types/data";
import { v4 } from "uuid";
import RHNodeEditor from "./RHNodeEditor";
import { addNode, findNode } from "../util";

type RHNodeProps = {
  nodeDatum: TreeNodeDatum;
  toggleNode: () => void;
  nodeWidth: number;
  nodeHeight: number;
  rootData: RHNodeData;
  setRootData: (newData: RHNodeData) => void;
};

export default function RHNode({
  nodeDatum,
  toggleNode,
  nodeWidth,
  nodeHeight,
  rootData,
  setRootData,
}: RHNodeProps) {
  const [isEditing, setIsEditing] = useState(false);

  const r = 15;

  // @ts-expect-error uuid will exist
  const nodeData = findNode(rootData, nodeDatum.uuid);

  return (
    nodeData && (
      <g>
        <circle r={r}></circle>
        {/* `foreignObject` requires width & height to be explicitly set. */}
        <foreignObject
          width={nodeWidth}
          height={0.8 * nodeHeight}
          x={-0.5 * nodeWidth}
          y={-0}
        >
          <RHNodeEditor
            rootData={rootData}
            setRootData={setRootData}
            isOpen={isEditing}
            rhNodeData={nodeData}
            onClose={() => {
              setIsEditing(false);
            }}
          />
          <div
            style={{
              border: "1px solid black",
              backgroundColor: "#dedede",
              borderRadius: "0.5rem",
              color: "#1a1a1a",
            }}
          >
            <h3 style={{ textAlign: "center" }}>
              {nodeDatum.name.length < 20
                ? nodeDatum.name
                : `${nodeDatum.name.slice(0, 17)}...`}
            </h3>
            {/* probably move prompt and repsonse to a widget later */}
            {/* <p style={{ textAlign: "center" }}>Prompt: {nodeDatum.prompt}</p> */}
            {/* <p style={{ textAlign: "center" }}>Response: {nodeDatum.response}</p> */}
            {/* test */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <button onClick={() => setIsEditing(true)}>Edit node</button>
              <button
                onClick={() => {
                  // @ts-expect-error uuid will exist
                  const uuid: string = nodeDatum.uuid;
                  const newNode: RHNodeData = {
                    name: "new child",
                    parentName: nodeDatum.name,
                    uuid: v4(),
                    prompt: "hi",
                    response: "hi",
                    children: [],
                  };
                  addNode(rootData, uuid, newNode);
                  const newData = { ...rootData };
                  setRootData(newData);
                }}
              >
                Add child
              </button>
            </div>
            {nodeDatum.children!.length > 0 ? (
              <button style={{ width: "100%" }} onClick={toggleNode}>
                {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
              </button>
            ) : null}
          </div>
        </foreignObject>
      </g>
    )
  );
}
