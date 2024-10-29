import {gql, useMutation, useQuery} from "@apollo/client";

export const LOAD_MAPPING_DATA = gql`
    query LoadMappingData($path: String!) {
        loadMappingData(path: $path) {
            id
        }
    }
`;


export const SAVE_MAPPING_DATA = gql`
    mutation SaveMappingData($path: String, $mappingData: JSON!) {
        saveMappingData(path: $path, mappingData: $mappingData)
    }
`;


export const useMappingDataService = (path?: string) => {
  const loadMappingDataQuery = useQuery(LOAD_MAPPING_DATA, {variables: {path: path}, fetchPolicy: "no-cache"});
  const [saveMappingData, saveMappingDataResult] = useMutation(SAVE_MAPPING_DATA);

  return {
    loadMappingDataQuery,
    saveMappingData, saveMappingDataResult
  };
}
