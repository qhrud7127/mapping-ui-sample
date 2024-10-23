import React, {useCallback, useState} from 'react';
import type {DialogContext} from './dialog-context';
import {dialogContext} from './dialog-context';
import {BaseAlertDialog, BaseAlertDialogProps} from "../../components/dialog/base-alert-dialog/base-alert-dialog.tsx";

export const DialogProvider: React.FC<React.PropsWithChildren> = ({
                                                                    children,
                                                                  }) => {
  // Alert dialog
  const [showAlert, setShowAlert] = useState(false);
  const [alertParams, setAlertParams] = useState<BaseAlertDialogProps>({
    title: '',
  });
  const showAlertHandler: DialogContext['showAlert'] = useCallback(
    (params) => {
      setAlertParams(params);
      setShowAlert(true);
    },
    [setShowAlert, setAlertParams]
  );
  const closeAlertHandler = useCallback(() => {
    setShowAlert(false);
  }, [setShowAlert]);

  return (
    <dialogContext.Provider
      value={{
        showAlert: showAlertHandler,
        closeAlert: closeAlertHandler,
      }}
    >
      {children}
      <BaseAlertDialog dialog={{open: showAlert}} {...alertParams} />
    </dialogContext.Provider>
  );
};
