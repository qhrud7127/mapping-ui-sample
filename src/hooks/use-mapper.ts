import {useContext} from 'react';
import {mapperContext} from "../context/mapper/mapper-context.tsx";

export const useMapper = () => useContext(mapperContext);
