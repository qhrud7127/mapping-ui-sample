import {RelationshipEdge, RelationshipEdgeType} from "./edge/relationship-edge.tsx";
import {
  addEdge,
  NodeDimensionChange,
  NodePositionChange,
  NodeRemoveChange,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import {MIN_TABLE_SIZE, TableNode, TableNodeType} from "./node/table-node.tsx";
import {useCallback, useEffect, useMemo, useState} from "react";
import {sample} from "../data/sample.ts";
import {DBTable} from "../lib/domain/db-table.ts";
import {useChartDB} from "../hooks/use-chartdb.ts";
import {LEFT_HANDLE_ID_PREFIX, TARGET_ID_PREFIX} from "./node/table-node-field.tsx";
import {debounce} from "../lib/utils.ts";
import {createGraph, Graph} from "../lib/graph.ts";
import {findTableOverlapping} from "./canvas-utils.ts";
import {areFieldTypesCompatible} from "../lib/data/data-types/data-types.ts";
import {useToast} from "../components/toast/use-toast.ts";

export type EdgeType = RelationshipEdgeType;
type AddEdgeParams = Parameters<typeof addEdge<EdgeType>>[0];

const initialEdges: EdgeType[] = [];

const edgeTypes = {
  'relationship-edge': RelationshipEdge,
};

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
  const {getEdge, getNode} = useReactFlow();
  const {toast} = useToast();

  const [nodes, setNodes, onNodesChange] = useNodesState<TableNodeType>(
    sample.map((table) => tableToTableNode(table)
    )
  );

  const nodeTypes = useMemo(() => ({table: TableNode}), []);
  const {
    relationships,
    updateTablesState,
    removeRelationships,
    getField,
    databaseType,
    createRelationship
  } = useChartDB();


  const [overlapGraph, setOverlapGraph] = useState<Graph<string>>(createGraph());

  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeType>(initialEdges);


  useEffect(() => {
    const targetIndexes: Record<string, number> = relationships.reduce(
      (acc, relationship) => {
        acc[
          `${relationship.targetTableId}${relationship.targetFieldId}`
          ] = 0;
        return acc;
      },
      {} as Record<string, number>
    );

    setEdges([
      ...relationships.map(
        (relationship): RelationshipEdgeType => ({
          id: relationship.id,
          source: relationship.sourceTableId,
          target: relationship.targetTableId,
          sourceHandle: `${LEFT_HANDLE_ID_PREFIX}${relationship.sourceFieldId}`,
          targetHandle: `${TARGET_ID_PREFIX}${targetIndexes[`${relationship.targetTableId}${relationship.targetFieldId}`]++}_${relationship.targetFieldId}`,
          type: 'relationship-edge',
          data: {relationship},
        })
      ),
    ]);
  }, [relationships, setEdges]);
  /*

    useEffect(() => {
      setNodes(
        tables.map((table) => {
          const isOverlapping =
            (overlapGraph.graph.get(table.id) ?? []).length > 0;
          const node = tableToTableNode(table);

          return {
            ...node,
            data: {
              ...node.data,
              isOverlapping,
            },
          };
        })
      );
    }, [
      tables,
      setNodes,
      overlapGraph.lastUpdated,
      overlapGraph.graph,
    ]);

  */

  const updateOverlappingGraphOnChanges = useCallback(
    ({
       positionChanges,
       sizeChanges,
     }: {
      positionChanges: NodePositionChange[];
      sizeChanges: NodeDimensionChange[];
    }) => {
      if (positionChanges.length > 0 || sizeChanges.length > 0) {
        let newOverlappingGraph: Graph<string> = overlapGraph;

        for (const change of positionChanges) {
          newOverlappingGraph = findTableOverlapping(
            {node: getNode(change.id) as TableNodeType},
            {nodes: nodes.filter((node) => !node.hidden)},
            newOverlappingGraph
          );
        }

        for (const change of sizeChanges) {
          newOverlappingGraph = findTableOverlapping(
            {node: getNode(change.id) as TableNodeType},
            {nodes: nodes.filter((node) => !node.hidden)},
            newOverlappingGraph
          );
        }

        setOverlapGraph(newOverlappingGraph);
      }
    },
    [nodes, overlapGraph, setOverlapGraph, getNode]
  );


  const updateOverlappingGraphOnChangesDebounced = debounce(
    updateOverlappingGraphOnChanges,
    200
  );


  const onNodesChangeHandler: OnNodesChange<TableNodeType> = useCallback(
    (changes) => {
      const positionChanges: NodePositionChange[] = changes.filter(
        (change) => change.type === 'position' && !change.dragging
      ) as NodePositionChange[];

      const removeChanges: NodeRemoveChange[] = changes.filter(
        (change) => change.type === 'remove'
      ) as NodeRemoveChange[];

      const sizeChanges: NodeDimensionChange[] = changes.filter(
        (change) => change.type === 'dimensions' && change.resizing
      ) as NodeDimensionChange[];

      if (
        positionChanges.length > 0 ||
        removeChanges.length > 0 ||
        sizeChanges.length > 0
      ) {
        updateTablesState((currentTables) =>
          currentTables
            .map((currentTable) => {
              const positionChange = positionChanges.find(
                (change) => change.id === currentTable.id
              );
              const sizeChange = sizeChanges.find(
                (change) => change.id === currentTable.id
              );
              if (positionChange || sizeChange) {
                return {
                  id: currentTable.id,
                  ...(positionChange
                    ? {
                      x: positionChange.position?.x,
                      y: positionChange.position?.y,
                    }
                    : {}),
                  ...(sizeChange
                    ? {
                      width:
                        sizeChange.dimensions
                          ?.width ??
                        currentTable.width,
                    }
                    : {}),
                };
              }
              return currentTable;
            })
            .filter(
              (table) =>
                !removeChanges.some(
                  (change) => change.id === table.id
                )
            )
        );
      }

      updateOverlappingGraphOnChangesDebounced({
        positionChanges,
        sizeChanges,
      });

      return onNodesChange(changes);
    },
    [
      onNodesChange,
      updateTablesState,
      updateOverlappingGraphOnChangesDebounced,
    ]
  );


  const onEdgesChangeHandler: OnEdgesChange<EdgeType> = useCallback(
    (changes) => {
      const removeChanges: NodeRemoveChange[] = changes.filter(
        (change) => change.type === 'remove'
      ) as NodeRemoveChange[];

      const edgesToRemove = removeChanges
        .map((change) => getEdge(change.id) as EdgeType | undefined)
        .filter((edge) => !!edge);

      const relationshipsToRemove: string[] = (
        edgesToRemove.filter(
          (edge) => edge?.type === 'relationship-edge'
        ) as RelationshipEdgeType[]
      ).map((edge) => edge?.data?.relationship?.id as string);


      if (relationshipsToRemove.length > 0) {
        removeRelationships(relationshipsToRemove);
      }

      return onEdgesChange(changes);
    },
    [getEdge, onEdgesChange, removeRelationships]
  );


  const onConnectHandler = useCallback(
    async (params: AddEdgeParams) => {

      const sourceTableId = params.source;
      const targetTableId = params.target;
      const sourceFieldId = params.sourceHandle?.split('_')?.pop() ?? '';
      const targetFieldId = params.targetHandle?.split('_')?.pop() ?? '';
      const sourceField = getField(sourceTableId, sourceFieldId);
      const targetField = getField(targetTableId, targetFieldId);

      if (!sourceField || !targetField) {
        return;
      }

      if (
        !areFieldTypesCompatible(
          sourceField.type,
          targetField.type,
          databaseType
        )
      ) {
        toast({
          title: 'Field types are not compatible',
          variant: 'destructive',
          description:
            'Relationships can only be created between compatible field types',
        });
        return;
      }

      createRelationship({
        sourceTableId,
        targetTableId,
        sourceFieldId,
        targetFieldId,
      });
    },
    [createRelationship, getField, toast, databaseType]
  );
  // 테스트 커밋222

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <ReactFlow
        className="canvas-cursor-default nodes-animated"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        onConnect={onConnectHandler}
        proOptions={{
          hideAttribution: true,
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          animated: false,
          type: 'relationship-edge',
        }}
      />

    </div>
  )
}


