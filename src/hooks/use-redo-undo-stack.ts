import { useContext } from 'react';
import {redoUndoStackContext} from "../context/history/redo-undo-stack-context.tsx";

export const useRedoUndoStack = () => useContext(redoUndoStackContext);
