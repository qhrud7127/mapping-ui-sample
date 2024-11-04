import {gql, useLazyQuery, useMutation} from "@apollo/client";

export const LOAD_MAPPING_DATA = gql`
    query LoadMappingData($path: String!) {
        loadMappingData(path: $path) {
            id
            name
            objects {
                id
                name
                fields {
                    id
                    name
                    type {
                        id
                        name
                    }
                }
                x
                y
                color
            }
            relationships {
                id
                name
                sourceCardinality
                sourceFieldId
                sourceTableId
                targetCardinality
                targetFieldId
                targetTableId
                transformations {
                    id
                    type
                    value
                }
            }
        }
    }
`;


export const SAVE_MAPPING_DATA = gql`
    mutation SaveMappingData($path: String, $mappingData: JSON!) {
        saveMappingData(path: $path, mappingData: $mappingData)
    }
`;


export const useMappingDataService = () => {
  const [loadMappingDataQuery] = useLazyQuery(LOAD_MAPPING_DATA);
  const [saveMappingData, saveMappingDataResult] = useMutation(SAVE_MAPPING_DATA);

  return {
    loadMappingDataQuery,
    saveMappingData, saveMappingDataResult
  };
}
