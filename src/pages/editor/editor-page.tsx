import {ThemeProvider} from "../../context/theme/theme-provider.tsx";
import {ChartDBProvider} from "../../context/chartdb/chartdb-provider.tsx";
import {ReactFlowProvider} from "@xyflow/react";
import {Canvas} from "../../canvas/canvas.tsx";
import {LocalConfigProvider} from "../../context/local-config/local-config-provider.tsx";


export const EditorPage = () => (
  <LocalConfigProvider> {/*theme local storage*/}
    <ThemeProvider> {/*theme setting*/}
      <ChartDBProvider>
        <ReactFlowProvider>
          <Canvas/>
        </ReactFlowProvider>
      </ChartDBProvider>
    </ThemeProvider>
  </LocalConfigProvider>
)
