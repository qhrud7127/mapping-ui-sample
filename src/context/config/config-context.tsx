import { createContext } from 'react';
import {ChartDBConfig} from "../../lib/domain/config.ts";
import {emptyFn} from "../../lib/utils.ts";

export interface ConfigContext {
    config?: ChartDBConfig;
    updateConfig: (config: Partial<ChartDBConfig>) => Promise<void>;
}

export const ConfigContext = createContext<ConfigContext>({
    config: undefined,
    updateConfig: emptyFn,
});
