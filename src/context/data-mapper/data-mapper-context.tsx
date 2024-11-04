import {createContext} from 'react';

import {emptyFn} from "../../lib/utils.ts";
import {Table} from "../../lib/domain/table.ts";
import {Field} from "../../lib/domain/field.ts";
import {Diagram} from "../../lib/domain/diagram.ts";
import {Relationship} from "../../lib/domain/relationship.ts";
import {EventEmitter} from "ahooks/lib/useEventEmitter";

export type MapperEventType =
  | 'add_tables'
  | 'update_table'
  | 'remove_tables'
  | 'add_field'
  | 'remove_field'
  | 'load_diagram';

export type MapperEventBase<T extends MapperEventType, D> = {
  action: T;
  data: D;
};

export type UpdateTableEvent = MapperEventBase<
  'update_table',
  { id: string; table: Partial<Table> }
>;

export type LoadDiagramEvent = MapperEventBase<
  'load_diagram',
  { diagram: Diagram }
>;

export type MapperEvent =
  | UpdateTableEvent
  | LoadDiagramEvent;

export interface DataMapperContext {
  tables: Table[];
  setTables: (tables: Table[]) => void;
  relationships: Relationship[];
  setRelationships: (relationships: Relationship[]) => void;
  selectedRelationship: Relationship | null;
  expandedId: string | null;
  events: EventEmitter<MapperEvent>;

  // General operations
  // loadDiagram: (diagramId: string) => Promise<Diagram | undefined>;

  // Table operations
  getTable: (id: string) => Table | null;
  updateTable: (
    id: string,
    table: Partial<Table>,
    options?: { updateHistory: boolean }
  ) => Promise<void>;
  updateTablesState: (
    updateFn: (tables: Table[]) => PartialExcept<Table, 'id'>[],
    options?: { updateHistory: boolean; forceOverride?: boolean }
  ) => Promise<void>;

  // Field operations
  getField: (tableId: string, fieldId: string) => Field | null;
  updateField: (
    tableId: string,
    fieldId: string,
    field: Partial<Field>,
    options?: { updateHistory: boolean }
  ) => Promise<void>;

  // Relationship operations
  createRelationship: (params: {
    sourceTableId: string;
    targetTableId: string;
    sourceFieldId: string;
    targetFieldId: string;
  }) => Promise<Relationship>;
  addRelationship: (
    relationship: Relationship,
    options?: { updateHistory: boolean }
  ) => Promise<void>;
  addRelationships: (
    relationships: Relationship[],
    options?: { updateHistory: boolean }
  ) => Promise<void>;
  getRelationship: (id: string) => Relationship | null;
  selectRelationShip: (id: string) => Promise<void>;
  removeRelationship: (
    id: string,
  ) => Promise<void>;
  removeRelationships: (
    ids: string[],
  ) => Promise<void>;
  updateRelationship: (
    id: string,
    relationship: Partial<Relationship>,
  ) => Promise<void>;
  openRelationshipInPanel: (
    id: string,
  ) => Promise<void>;
}

export const dataMapperContext = createContext<DataMapperContext>({
  tables: [],
  setTables: emptyFn,
  relationships: [],
  setRelationships: emptyFn,
  selectedRelationship: null,
  expandedId: null,
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
  selectRelationShip: emptyFn,
  removeRelationship: emptyFn,
  updateRelationship: emptyFn,
  removeRelationships: emptyFn,
  addRelationships: emptyFn,
  openRelationshipInPanel: emptyFn,
});
