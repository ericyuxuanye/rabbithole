import { TreeNodeDatum } from "react-d3-tree";
import { v4 } from "uuid";
import { RHNodeData } from "../types/data";
import { addNode, findNode, truncateString } from "../util";
import RHNodeEditor from "./RHNodeEditor";

type RHNodeProps = {
  nodeDatum: TreeNodeDatum;
  toggleNode: () => void;
  nodeWidth: number;
  nodeHeight: number;
  rootData: RHNodeData;
  setRootData: (newData: RHNodeData) => void;
  focusedUuid: string;
  setFocusedUuid: (focusedUuid: string) => void;
};

export default function RHNode({
  nodeDatum,
  toggleNode,
  nodeWidth,
  nodeHeight,
  rootData,
  setRootData,
  focusedUuid,
  setFocusedUuid,
}: RHNodeProps) {
  const r = 15;

  // @ts-expect-error uuid will exist
  const nodeData = findNode(rootData, nodeDatum.uuid);

  const handleClose = () => setFocusedUuid("");

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
            isOpen={focusedUuid === nodeData.uuid}
            rhNodeData={nodeData}
            onClose={handleClose}
            setFocusedUuid={setFocusedUuid}
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
              {truncateString(nodeDatum.name, 20)}
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <button onClick={() => setFocusedUuid(nodeData.uuid)}>
                View query details
              </button>
              <button
                onClick={() => {
                  // @ts-expect-error uuid will exist
                  const uuid: string = nodeDatum.uuid;
                  const newNode: RHNodeData = {
                    name: "Subquery",
                    parentName: nodeData.name,
                    parentUuid: nodeData.uuid,
                    uuid: v4(),
                    prompt: "Enter prompt",
                    response: "",
                    prompts: [],
                    responses: [],
                    children: [],
                  };
                  addNode(rootData, uuid, newNode);
                  const newData = { ...rootData };
                  setRootData(newData);
                }}
              >
                Add subquery
              </button>
            </div>
            {nodeDatum.children!.length > 0 ? (
              <button style={{ width: "100%" }} onClick={toggleNode}>
                {nodeDatum.__rd3t.collapsed
                  ? "See subqueries"
                  : "Hide subqueries"}
              </button>
            ) : null}
          </div>
        </foreignObject>
      </g>
    )
  );
}
