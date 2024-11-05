import {Table2} from "lucide-react";
import {Table} from "../../lib/domain/table.ts";
import {Field} from "../../lib/domain/field.ts";

export interface RelationshipInfoProps {
  table: Table | null;
  field: Field | null;
}

export const RelationshipInfo = ({table, field}: RelationshipInfoProps) => {
  return (

    <div className={"pb-2 px-5 w-1/2"} style={{borderLeft: `4px solid ${table?.color}`}}>
      <div className="flex gap-2 items-center">
        <Table2 className="size-3.5 shrink-0"/>
        <p className="truncate text-base">
          {table?.name}
        </p>
      </div>
      <p className="truncate text-sm">
        {field?.name} ({field?.type.name})
      </p>
    </div>
  )
}
