import type {DBRelationship} from './db-relationship';
import type {DBTable} from './db-table';

export interface Diagram {
  id: string;
  name: string;
  tables?: DBTable[];
  relationships?: DBRelationship[];
  createdAt: Date;
  updatedAt: Date;
}
