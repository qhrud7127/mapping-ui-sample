import {type Field} from './field.ts';

export interface Table {
  id: string;
  name: string;
  schema?: string;
  x: number;
  y: number;
  fields: Field[];
  color: string;
  isView: boolean;
  isMaterializedView?: boolean;
  createdAt: number;
  width?: number;
  comments?: string;
  hidden?: boolean;
}
