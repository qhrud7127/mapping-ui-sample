import { useContext } from 'react';
import {LocalConfigContext} from "../context/local-config/local-config-context.tsx";

export const useLocalConfig = () => useContext(LocalConfigContext);
