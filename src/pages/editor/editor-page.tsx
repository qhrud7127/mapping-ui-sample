import {ThemeProvider} from "../../context/theme/theme-provider.tsx";
import {ChartDBProvider} from "../../context/chartdb/chartdb-provider.tsx";
import {ReactFlowProvider} from "@xyflow/react";
import {Canvas} from "../../section/canvas/canvas.tsx";
import {LocalConfigProvider} from "../../context/local-config/local-config-provider.tsx";
import {Relationship} from "../../section/panel/relationship.tsx";


export const EditorPage = () => (
  <LocalConfigProvider> {/*theme local storage*/}
    <ThemeProvider> {/*theme setting*/}
      <ChartDBProvider>
        <ReactFlowProvider>
          <Canvas/>
          <Relationship/>
        </ReactFlowProvider>
      </ChartDBProvider>
    </ThemeProvider>
  </LocalConfigProvider>
)
