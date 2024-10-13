import Tree from "react-d3-tree";
import { RHNodeData } from "../types/data";
import RHNode from "./RHNode";
import { useEffect, useRef, useState } from "react";

type RHTreeProps = {
  data: RHNodeData;
  setData: (newData: RHNodeData) => void;
};

export default function RHTree({ data, setData }: RHTreeProps) {
  const treeRef = useRef<HTMLDivElement>(null!);
  const nodeSize = { x: 200, y: 200 };
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Calculate the dimensions of the container after rendering
    const container = treeRef.current;
    if (container) {
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      // Adjust translate to center the tree
      setTranslate({ x: width / 2, y: 0.2 * height });
    }
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={treeRef}>
      <Tree
        data={data}
        nodeSize={nodeSize}
        orientation="vertical"
        pathFunc={"straight"}
        translate={translate}
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
