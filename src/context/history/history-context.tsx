import { createContext } from 'react';
import {emptyFn} from "../../lib/utils.ts";

export interface HistoryContext {
    undo: () => void;
    redo: () => void;
    hasUndo: boolean;
    hasRedo: boolean;
}

export const historyContext = createContext<HistoryContext>({
    undo: emptyFn,
    redo: emptyFn,
    hasUndo: false,
    hasRedo: false,
});
