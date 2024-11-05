import React, {useCallback, useState} from 'react';

import type {DataMapperContext, MapperEvent} from './data-mapper-context.tsx';
import {dataMapperContext} from './data-mapper-context.tsx';

import {useEventEmitter} from 'ahooks';
import {Table} from "../../lib/domain/table.ts";
import {deepCopy, generateId} from "../../lib/utils.ts";
import {Relationship} from "../../lib/domain/relationship.ts";
import {Field} from "../../lib/domain/field.ts";
import {sample} from "../../data/sample.ts";

export const DataMapperProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const events = useEventEmitter<MapperEvent>();
  const [tables, setTables] = useState<Table[]>(sample);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedRelationship, setSelectedRelationships] = useState<Relationship | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getTable: DataMapperContext['getTable'] = useCallback(
    (id: string) => tables.find((table) => table.id === id) ?? null,
    [tables]
  );

  const updateTable: DataMapperContext['updateTable'] = useCallback(
    async (
      id: string,
      table: Partial<Table>,
    ) => {
      setTables((tables) =>
        tables.map((t) => (t.id === id ? {...t, ...table} : t))
      );

      events.emit({
        action: 'update_table',
        data: {id, table},
      });
    },
    [
      setTables,
      getTable,
      events,
    ]
  );

  const updateTablesState: DataMapperContext['updateTablesState'] = useCallback(
    async (
      updateFn: (tables: Table[]) => PartialExcept<Table, 'id'>[],
      options = {updateHistory: true, forceOverride: false}
    ) => {
      const updateTables = (prevTables: Table[]) => {
        const updatedTables = updateFn(prevTables);
        if (options.forceOverride) {
          return updatedTables as Table[];
        }

        return prevTables
          .map((prevTable) => {
            const updatedTable = updatedTables.find(
              (t) => t.id === prevTable.id
            );
            return updatedTable
              ? {...prevTable, ...updatedTable}
              : prevTable;
          })
          .filter((prevTable) =>
            updatedTables.some((t) => t.id === prevTable.id)
          );
      };

      const prevTables = deepCopy(tables);
      const updatedTables = updateTables(tables);

      const tablesToDelete = prevTables.filter(
        (table) => !updatedTables.some((t) => t.id === table.id)
      );

      const relationshipsToRemove = relationships.filter((relationship) =>
        tablesToDelete.some(
          (table) =>
            table.id === relationship.sourceTableId ||
            table.id === relationship.targetTableId
        )
      );


      setRelationships((relationships) =>
        relationships.filter(
          (relationship) =>
            !relationshipsToRemove.some(
              (r) => r.id === relationship.id
            )
        )
      );

      setTables(updateTables);
    },
    [
      tables,
      setTables,
      relationships,
      events,
    ]
  );

  const getField: DataMapperContext['getField'] = useCallback(
    (tableId: string, fieldId: string) => {
      const table = getTable(tableId);
      return table?.fields.find((f) => f.id === fieldId) ?? null;
    },
    [getTable]
  );

  const updateField: DataMapperContext['updateField'] = useCallback(
    async (
      tableId: string,
      fieldId: string,
      field: Partial<Field>,
    ) => {
      setTables((tables) =>
        tables.map((table) =>
          table.id === tableId
            ? {
              ...table,
              fields: table.fields.map((f) =>
                f.id === fieldId ? {...f, ...field} : f
              ),
            }
            : table
        )
      );
    },
    [setTables, getField]
  );

  const addRelationships: DataMapperContext['addRelationships'] = useCallback(
    async (
      relationships: Relationship[],
    ) => {
      setRelationships((currentRelationships) => [
        ...currentRelationships,
        ...relationships,
      ]);
    },
    [setRelationships]
  );

  const addRelationship: DataMapperContext['addRelationship'] = useCallback(
    async (
      relationship: Relationship,
    ) => {
      return addRelationships([relationship]);
    },
    [addRelationships]
  );

  const createRelationship: DataMapperContext['createRelationship'] =
    useCallback(
      async ({
               sourceTableId,
               targetTableId,
               sourceFieldId,
               targetFieldId,
             }) => {
        const sourceTable = getTable(sourceTableId);
        const sourceTableName = sourceTable?.name ?? '';

        const sourceField = sourceTable?.fields.find(
          (field: { id: string }) => field.id === sourceFieldId
        );

        const sourceFieldName = sourceField?.name ?? '';

        const relationship: Relationship = {
          id: generateId(),
          name: `${sourceTableName}_${sourceFieldName}_fk`,
          sourceSchema: sourceTable?.schema,
          sourceTableId,
          targetSchema: sourceTable?.schema,
          targetTableId,
          sourceFieldId,
          targetFieldId,
          sourceCardinality: 'one',
          targetCardinality: 'one',
          createdAt: Date.now(),
          transformations: [],
        };

        await addRelationship(relationship);

        return relationship;
      },
      [addRelationship, getTable]
    );

  const getRelationship: DataMapperContext['getRelationship'] = useCallback(
    (id: string) =>
      relationships.find((relationship) => relationship.id === id) ??
      null,
    [relationships]
  );

  const selectRelationShip: DataMapperContext['selectRelationShip'] = useCallback(
    async (id: string) => {
      const selected = relationships.find((relationship) => relationship.id === id) ?? null
      setSelectedRelationships(selected)
    },
    [relationships]
  );

  const removeRelationships: DataMapperContext['removeRelationships'] =
    useCallback(
      async (ids: string[]) => {

        setRelationships((relationships) =>
          relationships.filter(
            (relationship) => !ids.includes(relationship.id)
          )
        );
      },
      [
        setRelationships,
        relationships,
      ]
    );

  const removeRelationship: DataMapperContext['removeRelationship'] =
    useCallback(
      async (id: string) => {
        return removeRelationships([id]);
      },
      [removeRelationships]
    );

  const updateRelationship: DataMapperContext['updateRelationship'] =
    useCallback(
      async (
        id: string,
        relationship: Partial<Relationship>,
      ) => {
        setRelationships((relationships) =>
          relationships.map((r) =>
            r.id === id ? {...r, ...relationship} : r
          )
        );
      },
      [
        setRelationships,
        getRelationship,
      ]
    );

  const openRelationshipInPanel: DataMapperContext['openRelationshipInPanel'] =
    useCallback(
      async (
        id: string,
      ) => {
        setExpandedId(id)
      },
      [setExpandedId]
    );

  return (
    <dataMapperContext.Provider
      value={{
        tables,
        setTables,
        relationships,
        setRelationships,
        expandedId,
        selectedRelationship,
        events,
        getTable,
        updateTable,
        updateTablesState,
        updateField,
        getField,
        addRelationship,
        addRelationships,
        createRelationship,
        getRelationship,
        selectRelationShip,
        removeRelationship,
        removeRelationships,
        updateRelationship,
        openRelationshipInPanel,
      }}
    >
      {children}
    </dataMapperContext.Provider>
  );
};
