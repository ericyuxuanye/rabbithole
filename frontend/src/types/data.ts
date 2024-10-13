import { RawNodeDatum } from "react-d3-tree";

export interface RHNodeData extends RawNodeDatum {
  name: string;
  parentName?: string;
  uuid: string;
  prompt: string;
  response: string;
  children?: RHNodeData[];
}
