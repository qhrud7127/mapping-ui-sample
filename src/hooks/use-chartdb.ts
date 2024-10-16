import { useContext } from 'react';
import {chartDBContext} from "../context/chartdb/chartdb-context.tsx";

export const useChartDB = () => useContext(chartDBContext);
