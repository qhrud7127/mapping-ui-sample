import {useChartDB} from "../../hooks/use-chartdb.ts";
import {Relationship} from "./relationship.tsx";

export const RelationshipList = () => {
  const {
    relationships,
  } = useChartDB();

  return (
    <div style={{width: '20vw', border: '1px solid red', padding: '20px'}}>{
      relationships.map((relationship, index) => (
        <Relationship key={index} relationship={relationship}/>
      ))
    }</div>
  )
}
