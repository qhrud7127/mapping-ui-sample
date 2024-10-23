import {useContext} from 'react';
import {dialogContext} from "../context/dialog/dialog-context.tsx";

export const useDialog = () => useContext(dialogContext);
