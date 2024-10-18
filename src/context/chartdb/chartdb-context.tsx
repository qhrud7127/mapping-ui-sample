import {createContext} from 'react';

import {emptyFn} from "../../lib/utils.ts";
import {DBTable} from "../../lib/domain/db-table.ts";
import {DBField} from "../../lib/domain/db-field.ts";
import {Diagram} from "../../lib/domain/diagram.ts";
import {DBRelationship} from "../../lib/domain/db-relationship.ts";
import {EventEmitter} from "ahooks/lib/useEventEmitter";

export type ChartDBEventType =
  | 'add_tables'
  | 'update_table'
  | 'remove_tables'
  | 'add_field'
  | 'remove_field'
  | 'load_diagram';

export type ChartDBEventBase<T extends ChartDBEventType, D> = {
  action: T;
  data: D;
};

export type UpdateTableEvent = ChartDBEventBase<
  'update_table',
  { id: string; table: Partial<DBTable> }
>;

export type LoadDiagramEvent = ChartDBEventBase<
  'load_diagram',
  { diagram: Diagram }
>;

export type ChartDBEvent =
  | UpdateTableEvent
  | LoadDiagramEvent;

export interface ChartDBContext {
  tables: DBTable[];
  relationships: DBRelationship[];
  events: EventEmitter<ChartDBEvent>;

  // General operations
  // loadDiagram: (diagramId: string) => Promise<Diagram | undefined>;

  // Table operations
  getTable: (id: string) => DBTable | null;
  updateTable: (
    id: string,
    table: Partial<DBTable>,
    options?: { updateHistory: boolean }
  ) => Promise<void>;
  updateTablesState: (
    updateFn: (tables: DBTable[]) => PartialExcept<DBTable, 'id'>[],
    options?: { updateHistory: boolean; forceOverride?: boolean }
  ) => Promise<void>;

  // Field operations
  getField: (tableId: string, fieldId: string) => DBField | null;
  updateField: (
    tableId: string,
    fieldId: string,
    field: Partial<DBField>,
    options?: { updateHistory: boolean }
  ) => Promise<void>;

  // Relationship operations
  createRelationship: (params: {
    sourceTableId: string;
    targetTableId: string;
    sourceFieldId: string;
    targetFieldId: string;
  }) => Promise<DBRelationship>;
  addRelationship: (
    relationship: DBRelationship,
    options?: { updateHistory: boolean }
  ) => Promise<void>;
  addRelationships: (
    relationships: DBRelationship[],
    options?: { updateHistory: boolean }
  ) => Promise<void>;
  getRelationship: (id: string) => DBRelationship | null;
  removeRelationship: (
    id: string,
    options?: { updateHistory: boolean }
  ) => Promise<void>;
  removeRelationships: (
    ids: string[],
    options?: { updateHistory: boolean }
  ) => Promise<void>;
  updateRelationship: (
    id: string,
    relationship: Partial<DBRelationship>,
    options?: { updateHistory: boolean }
  ) => Promise<void>;
}

export const chartDBContext = createContext<ChartDBContext>({
  tables: [],
  relationships: [],
  events: new EventEmitter(),

  // General operations
  // loadDiagram: emptyFn,

  // Table operations
  getTable: emptyFn,
  updateTable: emptyFn,
  updateTablesState: emptyFn,

  // Field operations
  updateField: emptyFn,
  getField: emptyFn,

  // Relationship operations
  createRelationship: emptyFn,
  addRelationship: emptyFn,
  getRelationship: emptyFn,
  removeRelationship: emptyFn,
  updateRelationship: emptyFn,
  removeRelationships: emptyFn,
  addRelationships: emptyFn,
});
