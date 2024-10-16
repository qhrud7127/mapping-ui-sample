import { useContext } from 'react';
import {layoutContext} from "../context/layout/layout-context.tsx";

export const useLayout = () => useContext(layoutContext);
