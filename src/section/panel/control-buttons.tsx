import {Button} from "@mui/material";
import {useMappingDataService} from "../../service/use-mapping-data-service.ts";
import {useDataMapper} from "../../hooks/use-data-mapper.ts";
import {generateId} from "../../lib/utils.ts";

export const ControlButtons = () => {
  const fileName = 'mapping'
  const path = 'C:\\Users\\User\\vtw\\DnAProjects\\mapping-test\\' + fileName + '.yaml'
  const {saveMappingData, loadMappingDataQuery} = useMappingDataService()
  const {relationships, tables, setTables, setRelationships} = useDataMapper()

  const saveData = () => {
    console.log(tables)
    saveMappingData({
      variables: {
        path: path,
        mappingData: {id: generateId(), name: 'test', objects: tables, relationships: relationships}
      }
    })
  }

  const loadData = () => {
    loadMappingDataQuery({variables: {path: path}, fetchPolicy: "no-cache",}).then((e) => {
      const mappingData = e.data.loadMappingData;
      console.log(mappingData)
      setTables(mappingData?.objects)
      setRelationships(mappingData?.relationships)
    });
  }

  return (
    <>
      <Button onClick={saveData}>save</Button>
      <Button onClick={loadData}>select file</Button>
    </>
  )
}
