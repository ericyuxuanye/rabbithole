import { RHNodeData } from "./types/data";

export const findNode = (node: RHNodeData, uuid: string): RHNodeData | undefined => {
  if (node.uuid === uuid) {
    return node;
  }
  for (const child of node.children!) {
    const node = findNode(child, uuid);
    if (node) return node;
  }
};

export const addNode = (node: RHNodeData, uuid: string, newNode: RHNodeData) => {
  const parentNode = findNode(node, uuid);
  if (parentNode) {
    parentNode.children!.push(newNode);
  }
};
