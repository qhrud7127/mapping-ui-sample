import {IconButton, Tooltip} from "@mui/material";

type Props = {
  title?: string;
  clickEvent: () => void;
  children: React.ReactNode;
};

export const IconTooltipButton = ({title, clickEvent, children}: Props) =>
  (
    <Tooltip title={title}>
      <IconButton className={"text-gray-600 dark:text-primary hover:bg-primary-foreground"} onClick={clickEvent}>
        {children}
      </IconButton>
    </Tooltip>
  )


