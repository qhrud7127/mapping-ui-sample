import {useChartDB} from "../../hooks/use-chartdb.ts";
import {Relationship} from "./relationship.tsx";
import {useEffect, useState} from "react";

export const RelationshipList = () => {
  const {
    relationships,
    expandedId,
  } = useChartDB();

  const [expanded, setExpanded] = useState<string | null>(expandedId);

  useEffect(() => {
    setExpanded(expandedId)
  }, [expandedId]);

  const handleChange = (id: string | null) => (_e: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? id : null);
  };

  return (
    <div style={{width: '20vw', borderRight: '2px solid gray', padding: '20px'}}
         className={'bg-slate-200 dark:bg-slate-950'}>
      {
        relationships.map((relationship) => (
          <Relationship key={relationship.id}
                        relationship={relationship}
                        onChange={handleChange(relationship.id)}
                        expanded={expanded === relationship.id}/>
        ))
      }</div>
  )
}
