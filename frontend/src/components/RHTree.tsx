import Tree, {
  RawNodeDatum,
  RenderCustomNodeElementFn,
  TreeNodeDatum,
} from "react-d3-tree";
import { v4 } from "uuid";

export interface RHNodeData extends RawNodeDatum {
  name: string;
  uuid: string;
  prompt: string;
  response: string;
  children?: RHNodeData[];
}

const addNode = (node: RHNodeData, uuid: string, newNode: RHNodeData) => {
  if (node.uuid === uuid) {
    node.children!.push(newNode);
    return;
  }
  for (const child of node.children!) {
    addNode(child, uuid, newNode);
  }
};

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  data,
  foreignObjectProps,
  setData,
}: {
  nodeDatum: TreeNodeDatum;
  toggleNode: () => void;
  foreignObjectProps: any;
  data: RHNodeData;
  setData: React.Dispatch<React.SetStateAction<RHNodeData>>;
}) => (
  <g>
    <circle r={15}></circle>
    {/* `foreignObject` requires width & height to be explicitly set. */}
    <foreignObject {...foreignObjectProps}>
      <div
        style={{
          border: "1px solid black",
          backgroundColor: "#dedede",
          borderRadius: "0.5rem",
          color: "#1a1a1a",
        }}
      >
        <h3 style={{ textAlign: "center" }}>{nodeDatum.name}</h3>
        {/* probably move prompt and repsonse to a widget later */}
        {/* <p style={{ textAlign: "center" }}>Prompt: {nodeDatum.prompt}</p> */}
        {/* <p style={{ textAlign: "center" }}>Response: {nodeDatum.response}</p> */}
        {/* test */}
        <button
          onClick={() => {
            // @ts-expect-error will exist
            const uuid: string = nodeDatum.uuid;
            const newNode: RHNodeData = {
              name: "new child",
              uuid: v4(),
              prompt: "hi",
              response: "hi",
              children: [],
            };
            addNode(data, uuid, newNode);
            const newData = { ...data };
            setData(newData);
          }}
        >
          Add child
        </button>
        {nodeDatum.children!.length > 0 ? (
          <button style={{ width: "100%" }} onClick={toggleNode}>
            {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
          </button>
        ) : null}
      </div>
    </foreignObject>
  </g>
);

type RHTreeProps = {
  data: RHNodeData;
  setData: React.Dispatch<React.SetStateAction<RHNodeData>>;
};

export default function RHTree({ data, setData }: RHTreeProps) {
  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Tree
        data={data}
        nodeSize={nodeSize}
        orientation="vertical"
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({
            ...rd3tProps,
            foreignObjectProps,
            data,
            setData,
          })
        }
      />
    </div>
  );
}
