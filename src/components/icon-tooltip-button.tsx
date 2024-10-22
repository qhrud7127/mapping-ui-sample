import {IconButton, Tooltip} from "@mui/material";

type Props = {
  title?: string;
  clickEvent: () => void;
  children: React.ReactNode;
};

export const IconTooltipButton = ({title, clickEvent, children}: Props) =>
  (
    <Tooltip title={title}>
      <IconButton onClick={clickEvent}>
        {children}
      </IconButton>
    </Tooltip>
  )


