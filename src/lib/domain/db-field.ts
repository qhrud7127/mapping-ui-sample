import {generateId} from '../utils';
import {DataType} from "./data-type.ts";
import {ColumnInfo} from "../../data/metadata-types/column-info.ts";
import {TableInfo} from "../../data/metadata-types/table-info.ts";
import {PrimaryKeyInfo} from "../../data/metadata-types/primary-key-info.ts";
import {AggregatedIndexInfo} from "../../data/metadata-types/index-info.ts";

export interface DBField {
  id: string;
  name: string;
  type: DataType;
  primaryKey: boolean;
  unique: boolean;
  nullable: boolean;
  createdAt: number;
  characterMaximumLength?: string;
  precision?: number;
  scale?: number;
  default?: string;
  collation?: string;
  comments?: string;
}

export const createFieldsFromMetadata = ({
                                           columns,
                                           tableInfo,
                                           primaryKeys,
                                         }: {
  columns: ColumnInfo[];
  tableInfo: TableInfo;
  primaryKeys: PrimaryKeyInfo[];
}) => {

  const uniqueColumns = columns
    .filter(
      (col) =>
        col.table === tableInfo.table
    )
    .reduce((acc, col) => {
      if (!acc.has(col.name)) {
        acc.set(col.name, col);
      }
      return acc;
    }, new Map<string, ColumnInfo>());

  const sortedColumns = Array.from(uniqueColumns.values()).sort(
    (a, b) => a.ordinal_position - b.ordinal_position
  );

  const tablePrimaryKeys = primaryKeys
    .filter(
      (pk) =>
        pk.table === tableInfo.table
    )
    .map((pk) => pk.column.trim());

  return sortedColumns.map(
    (col: ColumnInfo): DBField => ({
      id: generateId(),
      name: col.name,
      type: {
        id: col.type.split(' ').join('_').toLowerCase(),
        name: col.type.toLowerCase(),
      },
      primaryKey: tablePrimaryKeys.includes(col.name),
      unique: Object.values(aggregatedIndexes).some(
        (idx) =>
          idx.unique &&
          idx.columns.length === 1 &&
          idx.columns[0].name === col.name
      ),
      nullable: col.nullable,
      ...(col.character_maximum_length &&
      col.character_maximum_length !== 'null'
        ? {character_maximum_length: col.character_maximum_length}
        : {}),
      ...(col.precision?.precision
        ? {precision: col.precision.precision}
        : {}),
      ...(col.precision?.scale ? {scale: col.precision.scale} : {}),
      ...(col.default ? {default: col.default} : {}),
      ...(col.collation ? {collation: col.collation} : {}),
      createdAt: Date.now(),
      comments: col.comment ? col.comment : undefined,
    })
  );
};
