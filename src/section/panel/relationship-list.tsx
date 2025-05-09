import {useDataMapper} from "../../hooks/use-data-mapper.ts";
import {RelationshipItem} from "./relationshipItem.tsx";
import {SyntheticEvent, useEffect, useState} from "react";
import {ControlButtons} from "./control-buttons.tsx";

export const RelationshipList = () => {
  const {
    relationships,
    expandedId,
  } = useDataMapper();

  const [expanded, setExpanded] = useState<string | null>(expandedId);

  useEffect(() => {
    setExpanded(expandedId)
  }, [expandedId]);

  const handleChange = (id: string | null) => (_e: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? id : null);
  };

  return (
    <div style={{width: '30vw', borderRight: '2px solid gray'}}
         className={'bg-slate-100/50 dark:bg-slate-950'}>
      <ControlButtons/>
      {relationships.map((relationship) => (
        <RelationshipItem key={relationship.id}
                          relationship={relationship}
                          onChange={handleChange(relationship.id)}
                          expanded={expanded === relationship.id}/>
      ))
      }</div>
  )
}
