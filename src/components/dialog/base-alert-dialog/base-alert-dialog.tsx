import React, {useCallback} from 'react';
import type {AlertDialogProps} from '@radix-ui/react-alert-dialog';
import {useDialog} from "../../../hooks/use-dialog.ts";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../alert-dialog/alert-dialog.tsx";


export interface BaseAlertDialogProps {
  title: string;
  description?: string;
  actionLabel?: string;
  closeLabel?: string;
  onAction?: () => void;
  dialog?: AlertDialogProps;
  onClose?: () => void;
  content?: React.ReactNode;
}

export const BaseAlertDialog: React.FC<BaseAlertDialogProps> = ({
                                                                  title,
                                                                  description,
                                                                  actionLabel,
                                                                  closeLabel,
                                                                  onAction,
                                                                  dialog,
                                                                  content,
                                                                  onClose,
                                                                }) => {
  const {closeAlert} = useDialog();

  const closeAlertHandler = useCallback(() => {
    onClose?.();
    closeAlert();
  }, [onClose, closeAlert]);

  const alertHandler = useCallback(() => {
    onAction?.();
    closeAlert();
  }, [onAction, closeAlert]);
  return (
    <AlertDialog
      {...dialog}
      onOpenChange={(open) => {
        if (!open) {
          closeAlert();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          )}
          {content}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {closeLabel && (
            <AlertDialogCancel onClick={closeAlertHandler}>
              {closeLabel}
            </AlertDialogCancel>
          )}
          {actionLabel && (
            <AlertDialogAction onClick={alertHandler}>
              {actionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
