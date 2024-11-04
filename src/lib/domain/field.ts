import {generateId} from '../utils';
import {DataType} from "./data-type.ts";
import {ColumnInfo} from "../../data/metadata-types/column-info.ts";
import {TableInfo} from "../../data/metadata-types/table-info.ts";

export interface Field {
  id: string;
  name: string;
  type: DataType;
}

export const createFieldsFromMetadata = ({
                                           columns,
                                           tableInfo,
                                         }: {
  columns: ColumnInfo[];
  tableInfo: TableInfo;
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


  return sortedColumns.map(
    (col: ColumnInfo): Field => ({
      id: generateId(),
      name: col.name,
      type: {
        id: col.type.split(' ').join('_').toLowerCase(),
        name: col.type.toLowerCase(),
      },
    })
  );
};
