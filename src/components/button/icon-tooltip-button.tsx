import {IconButton, Tooltip} from "@mui/material";
import {MouseEventHandler, ReactNode} from "react";

type Props = {
  title?: string;
  clickEvent: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

export const IconTooltipButton = ({title, clickEvent, children}: Props) =>
  (
    <Tooltip title={title}>
      <IconButton className={"text-gray-600 dark:text-primary hover:bg-primary-foreground"} onClick={clickEvent}>
        {children}
      </IconButton>
    </Tooltip>
  )


