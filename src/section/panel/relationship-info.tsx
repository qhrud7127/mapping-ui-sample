import {Table2} from "lucide-react";
import {Table} from "../../lib/domain/table.ts";
import {Field} from "../../lib/domain/field.ts";

export interface RelationshipInfoProps {
  table: Table | null;
  field: Field | null;
}

export const RelationshipInfo = ({table, field}: RelationshipInfoProps) => {
  return (<div className={"border-2 py-2 px-5 rounded-lg min-w-16"}>
    <div className="flex gap-2 items-center">
      <Table2 className="size-3.5 shrink-0"/>
      <p className="truncate font-bold text-base">
        {table?.name}
      </p>
    </div>
    <p className="truncate text-sm">
      {field?.name} ({field?.type.name})
    </p>
  </div>)
}
