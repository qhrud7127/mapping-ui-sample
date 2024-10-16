import {RelationshipEdgeType} from "./edge/relationship-edge.tsx";
import {ReactFlow, useNodesState} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import {MIN_TABLE_SIZE, TableNode, TableNodeType} from "./node/table-node.tsx";
import {useMemo} from "react";
import {sample} from "../data/sample.ts";
import {DBTable} from "../lib/domain/db-table.ts";

export type EdgeType = RelationshipEdgeType;

const initialEdges = [{id: 'e1-2', source: '04csyx8ds9t3rh93txiqs4dm4', target: 'n654h28i8yeeadznzht9mjc8f'}];

const tableToTableNode = (
  table: DBTable,
): TableNodeType => ({
  id: table.id,
  type: 'table',
  position: {x: table.x, y: table.y},
  data: {
    table,
    isOverlapping: false,
  },
  width: table.width ?? MIN_TABLE_SIZE,
});
export const Canvas = () => {
  const nodeTypes = useMemo(() => ({table: TableNode}), []);
  console.log(sample)


  const [nodes, setNodes, onNodesChange] = useNodesState<TableNodeType>(
    sample.map((table) => tableToTableNode(table))
  );

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <ReactFlow
        className="canvas-cursor-default nodes-animated"
        nodes={nodes} edges={initialEdges} nodeTypes={nodeTypes}/>
    </div>)
}


