import { TreeNodeDatum } from "react-d3-tree";
import { v4 } from "uuid";
import { RHNodeData } from "../types/data";
import { addNode, findNode, truncateString } from "../util";
import RHNodeEditor from "./RHNodeEditor";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

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
          width={0.95 * nodeWidth}
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
          <Box
            sx={{
              border: '1px solid black',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              color: '#1a1a1a',
              // padding: '1rem',
              textAlign: 'center',
              padding: '0.5rem',
              // width: '300px', // You can adjust this as needed
              // margin: '0 auto', // Center the box horizontally
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: '0.5rem', fontWeight: "600" }}>
              {truncateString(nodeDatum.name, 15)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75em', marginBottom: "0.5rem" }}>
              <Tooltip title={"View query details"}>
                <Button onClick={() => setFocusedUuid(nodeData.uuid)} variant="outlined" color="primary" sx={{ width: '48%' }}>
                  <FormatListBulletedIcon sx={{
                    stroke: 'none',    // Remove any stroke
                  }} />
                </Button>
              </Tooltip>
              <Tooltip title={"Add subquery"}>
                <Button onClick={() => {
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
                }} variant="outlined" color="secondary" sx={{ width: '48%' }}>
                  <AddIcon sx={{
                    stroke: 'none',    // Remove any stroke
                  }} />
                </Button>
              </Tooltip>
            </Box>

            {nodeDatum.children!.length > 0 ? (
              <Button variant="outlined" color="error" sx={{ width: '100%' }} onClick={toggleNode}>
                {nodeDatum.__rd3t.collapsed
                  ? "See subqueries"
                  : "Hide subqueries"}
              </Button>
            ) : null}
          </Box>
        </foreignObject>
      </g>
    )
  );
}
