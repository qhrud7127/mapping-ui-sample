import {useContext} from 'react';
import {dataMapperContext} from "../context/data-mapper/data-mapper-context.tsx";

export const useDataMapper = () => useContext(dataMapperContext);
