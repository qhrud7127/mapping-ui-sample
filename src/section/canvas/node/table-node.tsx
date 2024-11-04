import React from 'react';
import type {Node, NodeProps} from '@xyflow/react';
import {NodeResizer, useStore} from '@xyflow/react';

import type {EdgeType} from '../canvas.tsx';
import {Table2} from "lucide-react";
import {cn} from "../../../lib/utils.ts";
import {Table} from "../../../lib/domain/table.ts";
import {RelationshipEdgeType} from "../edge/relationship-edge.tsx";
import {Field} from "../../../lib/domain/field.ts";
import {TableNodeField} from "./table-node-field.tsx";

export type TableNodeType = Node<
  {
    table: Table;
  },
  'table'
>;

export const MAX_TABLE_SIZE = 450;
export const MIN_TABLE_SIZE = 224;

export const TableNode: React.FC<NodeProps<TableNodeType>> = React.memo(
  ({
     selected,
     dragging,
     id,
     data: {table},
   }) => {
    const edges = useStore((store) => store.edges) as EdgeType[];

    const selectedRelEdges = edges.filter(
      (edge) =>
        (edge.source === id || edge.target === id) &&
        (edge.selected || edge.data?.highlighted) &&
        edge.type === 'relationship-edge'
    ) as RelationshipEdgeType[];

    const focused = !!selected && !dragging;

    return (
      <div
        className={cn(
          'flex w-full flex-col border-2 bg-slate-50 dark:bg-slate-950 rounded-lg shadow-sm transition-transform duration-300',
          selected
            ? 'border-pink-600'
            : 'border-slate-500 dark:border-slate-700',
        )}
      >
        <NodeResizer
          isVisible={focused}
          lineClassName="!border-none !w-2"
          minWidth={MIN_TABLE_SIZE}
          maxWidth={MAX_TABLE_SIZE}
          shouldResize={(event) => event.dy === 0}
          handleClassName="!hidden"
        />
        <div
          className="h-2 rounded-t-[6px]"
          style={{backgroundColor: table.color}}
        ></div>
        <div className="group flex h-9 items-center justify-between bg-slate-200 px-2 dark:bg-slate-900">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Table2 className="size-3.5 shrink-0 text-gray-600 dark:text-primary"/>
            <p className="truncate text-sm font-bold">
              {table.name}
            </p>
          </div>
        </div>
        <div
          className="transition-[max-height] duration-200 ease-in-out"
        >
          {table.fields.map((field: Field) => (
            <TableNodeField
              key={field.id}
              focused={focused}
              tableNodeId={id}
              field={field}
              visible
              highlighted={selectedRelEdges.some(
                (edge) =>
                  edge.data?.relationship
                    .sourceFieldId === field.id ||
                  edge.data?.relationship
                    .targetFieldId === field.id
              )}
              isConnectable={!table.isView}
            />
          ))}
        </div>
      </div>
    );
  }
);

TableNode.displayName = 'TableNode';
