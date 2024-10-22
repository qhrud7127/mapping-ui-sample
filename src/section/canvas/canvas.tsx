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
import {sample} from "../../data/sample.ts";
import {DBTable} from "../../lib/domain/db-table.ts";
import {useChartDB} from "../../hooks/use-chartdb.ts";
import {LEFT_HANDLE_ID_PREFIX, TARGET_ID_PREFIX} from "./node/table-node-field.tsx";
import {useToast} from "../../components/toast/use-toast.ts";
import equal from 'fast-deep-equal';

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
  },
  width: table.width ?? MIN_TABLE_SIZE,
});

export const Canvas = () => {
  const {getEdge, getEdges} = useReactFlow();
  const {toast} = useToast();

  const [nodes, setNodes, onNodesChange] = useNodesState<TableNodeType>(
    sample.map((table) => tableToTableNode(table)
    )
  );
  const [selectedRelationshipIds, setSelectedRelationshipIds] = useState<
    string[]
  >([]);

  const nodeTypes = useMemo(() => ({table: TableNode}), []);
  const {
    relationships,
    updateTablesState,
    removeRelationships,
    getField,
    createRelationship
  } = useChartDB();

  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeType>(initialEdges);

  useEffect(() => {
    const selectedEdgesIds = edges
      .filter((edge) => edge.selected)
      .map((edge) => edge.id);

    if (equal(selectedEdgesIds, selectedRelationshipIds)) {
      return;
    }

    setSelectedRelationshipIds(selectedEdgesIds);
  }, [edges, setSelectedRelationshipIds, selectedRelationshipIds]);


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

  useEffect(() => {
    const allSelectedEdges = [
      ...selectedRelationshipIds,
    ];

    setEdges((edges) =>
      edges.map((edge): EdgeType => {
        const selected = allSelectedEdges.includes(edge.id);


        const relationshipEdge = edge as RelationshipEdgeType;
        return {
          ...relationshipEdge,
          data: {
            ...relationshipEdge.data!,
            highlighted: selected,
          },
          animated: selected,
          zIndex: selected ? 1 : 0,
        };
      })
    );
  }, [selectedRelationshipIds, setEdges, getEdges]);


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
      return onNodesChange(changes);
    },
    [
      onNodesChange,
      updateTablesState,
    ]
  );

  useEffect(() => {
    console.log(selectedRelationshipIds);
  }, [selectedRelationshipIds]);


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

      createRelationship({
        sourceTableId,
        targetTableId,
        sourceFieldId,
        targetFieldId,
      });
    },
    [createRelationship, getField, toast]
  );

  return (
    <div style={{width: '80vw', height: '100vh'}}>
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
        zoomOnScroll={false}
      />

    </div>
  )
}


