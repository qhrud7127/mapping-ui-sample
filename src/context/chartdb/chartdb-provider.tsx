import React, {useCallback, useState} from 'react';

import type {ChartDBContext, ChartDBEvent} from './chartdb-context';
import {chartDBContext} from './chartdb-context';

import {useEventEmitter} from 'ahooks';
import {DBTable} from "../../lib/domain/db-table.ts";
import {deepCopy, generateId} from "../../lib/utils.ts";
import {DBRelationship} from "../../lib/domain/db-relationship.ts";
import {DBField} from "../../lib/domain/db-field.ts";
import {sample} from "../../data/sample.ts";

export const ChartDBProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const events = useEventEmitter<ChartDBEvent>();
  const [tables, setTables] = useState<DBTable[]>(sample);
  const [relationships, setRelationships] = useState<DBRelationship[]>([]);

  const getTable: ChartDBContext['getTable'] = useCallback(
    (id: string) => tables.find((table) => table.id === id) ?? null,
    [tables]
  );

  const updateTable: ChartDBContext['updateTable'] = useCallback(
    async (
      id: string,
      table: Partial<DBTable>,
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

  const updateTablesState: ChartDBContext['updateTablesState'] = useCallback(
    async (
      updateFn: (tables: DBTable[]) => PartialExcept<DBTable, 'id'>[],
      options = {updateHistory: true, forceOverride: false}
    ) => {
      const updateTables = (prevTables: DBTable[]) => {
        const updatedTables = updateFn(prevTables);
        if (options.forceOverride) {
          return updatedTables as DBTable[];
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

  const getField: ChartDBContext['getField'] = useCallback(
    (tableId: string, fieldId: string) => {
      const table = getTable(tableId);
      return table?.fields.find((f) => f.id === fieldId) ?? null;
    },
    [getTable]
  );

  const updateField: ChartDBContext['updateField'] = useCallback(
    async (
      tableId: string,
      fieldId: string,
      field: Partial<DBField>,
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

  const addRelationships: ChartDBContext['addRelationships'] = useCallback(
    async (
      relationships: DBRelationship[],
    ) => {
      setRelationships((currentRelationships) => [
        ...currentRelationships,
        ...relationships,
      ]);
    },
    [setRelationships]
  );

  const addRelationship: ChartDBContext['addRelationship'] = useCallback(
    async (
      relationship: DBRelationship,
    ) => {
      return addRelationships([relationship]);
    },
    [addRelationships]
  );

  const createRelationship: ChartDBContext['createRelationship'] =
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

        const relationship: DBRelationship = {
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
        };

        await addRelationship(relationship);

        return relationship;
      },
      [addRelationship, getTable]
    );

  const getRelationship: ChartDBContext['getRelationship'] = useCallback(
    (id: string) =>
      relationships.find((relationship) => relationship.id === id) ??
      null,
    [relationships]
  );

  const removeRelationships: ChartDBContext['removeRelationships'] =
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

  const removeRelationship: ChartDBContext['removeRelationship'] =
    useCallback(
      async (id: string, options = {updateHistory: true}) => {
        return removeRelationships([id], options);
      },
      [removeRelationships]
    );

  const updateRelationship: ChartDBContext['updateRelationship'] =
    useCallback(
      async (
        id: string,
        relationship: Partial<DBRelationship>,
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

  return (
    <chartDBContext.Provider
      value={{
        tables,
        relationships,
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
        removeRelationship,
        removeRelationships,
        updateRelationship,
      }}
    >
      {children}
    </chartDBContext.Provider>
  );
};
