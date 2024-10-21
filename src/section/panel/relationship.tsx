import {useChartDB} from "../../hooks/use-chartdb.ts";
import {useEffect} from "react";

export const Relationship = () => {
  const {
    relationships,
    getSelectedRelationship
  } = useChartDB();

  useEffect(() => {
    console.log(getSelectedRelationship());
  }, [relationships, getSelectedRelationship]);

  return <div>{getSelectedRelationship()?.id}</div>
}
