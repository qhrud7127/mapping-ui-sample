import { useContext } from 'react';
import {ConfigContext} from "../context/config/config-context.tsx";

export const useConfig = () => useContext(ConfigContext);
