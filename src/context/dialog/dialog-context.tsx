import {createContext} from 'react';
import {emptyFn} from "../../lib/utils.ts";
import {BaseAlertDialogProps} from "../../components/dialog/base-alert-dialog/base-alert-dialog.tsx";

export interface DialogContext {
  // Alert dialog
  showAlert: (params: BaseAlertDialogProps) => void;
  closeAlert: () => void;
}

export const dialogContext = createContext<DialogContext>({
  closeAlert: emptyFn,
  showAlert: emptyFn,
});
