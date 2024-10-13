import Tree from "react-d3-tree";
import { RHNodeData } from "../types/data";
import RHNode from "./RHNode";

type RHTreeProps = {
  data: RHNodeData;
  setData: (newData: RHNodeData) => void;
};

export default function RHTree({ data, setData }: RHTreeProps) {
  const nodeSize = { x: 200, y: 200 };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Tree
        data={data}
        nodeSize={nodeSize}
        orientation="vertical"
        pathFunc={"straight"}
        renderCustomNodeElement={(rd3tProps) => (
          <RHNode
            {...{
              ...rd3tProps,
              nodeWidth: nodeSize.x,
              nodeHeight: nodeSize.y,
              rootData: data,
              setRootData: setData,
            }}
          />
        )}
      />
    </div>
  );
}
