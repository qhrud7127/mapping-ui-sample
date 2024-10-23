import {useCallback, useState} from 'react';
import {Scan, ZoomIn, ZoomOut} from 'lucide-react';
import {useOnViewportChange, useReactFlow} from '@xyflow/react';
import {IconTooltipButton} from "../../../components/button/icon-tooltip-button.tsx";
import {Card, CardContent} from "../../../components/card/card.tsx";
import {Button} from "@mui/material";

const convertToPercentage = (value: number) => `${Math.round(value * 100)}%`;


export const Toolbar = () => {
  const {getZoom, zoomIn, zoomOut, fitView} = useReactFlow();
  const [zoom, setZoom] = useState<string>(convertToPercentage(getZoom()));
  useOnViewportChange({
    onChange: ({zoom}) => {
      setZoom(convertToPercentage(zoom));
    },
  });

  const zoomDuration = 200;
  const zoomInHandler = () => {
    zoomIn({duration: zoomDuration});
  };

  const zoomOutHandler = () => {
    zoomOut({duration: zoomDuration});
  };

  const resetZoom = () => {
    fitView({
      minZoom: 1,
      maxZoom: 1,
      duration: zoomDuration,
    });
  };

  const showAll = useCallback(() => {
    fitView({
      duration: 500,
      padding: 0.1,
      maxZoom: 0.8,
    });
  }, [fitView]);

  return (
    <div className={'text-gray-600 dark:text-primary'}>
      <Card className="h-[44px] bg-secondary p-0 shadow-none">
        <CardContent className="flex h-full flex-row items-center p-1">
          <span>
            <IconTooltipButton clickEvent={showAll}>
              <Scan className="size-4"/>
            </IconTooltipButton>
          </span>
          <span>
            <IconTooltipButton clickEvent={zoomOutHandler}>
              <ZoomOut className="size-4"/>
            </IconTooltipButton>
          </span>
          <Button
            variant={'text'}
            onClick={resetZoom}
            className="w-[60px] p-2 hover:bg-primary-foreground text-gray-600 dark:text-primary"
          >
            {zoom}
          </Button>
          <span>
            <IconTooltipButton clickEvent={zoomInHandler}>
                <ZoomIn className="size-4"/>
            </IconTooltipButton>
          </span>
        </CardContent>
      </Card>
    </div>
  )
    ;
};
