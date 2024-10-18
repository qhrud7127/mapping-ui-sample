import {createContext} from 'react';
import {Theme} from "../theme/theme-context.tsx";
import {emptyFn} from "../../lib/utils.ts";

export interface LocalConfigContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const LocalConfigContext = createContext<LocalConfigContext>({
  theme: 'system',
  setTheme: emptyFn,
});
