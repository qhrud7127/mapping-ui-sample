import {Button} from "@mui/material";
import {useMappingDataService} from "../../service/use-mapping-data-service.ts";
import {useChartDB} from "../../hooks/use-chartdb.ts";
import {generateId} from "../../lib/utils.ts";

export const ControlButtons = () => {
  const {saveMappingData} = useMappingDataService()
  const {relationships, tables} = useChartDB()

  const saveData = () => {
    console.log(tables)
    console.log(relationships)
    const fileName = 'mapping'
    saveMappingData({
      variables: {
        path: 'C:\\Users\\User\\vtw\\DnAProjects\\mapping-test\\' + fileName + '.yaml',
        mappingData: {id: generateId(), name: 'test', objects: tables, relationships: relationships}
      }
    })
  }
  return (
    <>
      <Button onClick={saveData}>save</Button>
      <Button>select file</Button>
    </>
  )
}
