import type {Relationship} from './relationship.ts';
import type {Table} from './table.ts';

export interface Diagram {
  id: string;
  name: string;
  tables?: Table[];
  relationships?: Relationship[];
  createdAt: Date;
  updatedAt: Date;
}
