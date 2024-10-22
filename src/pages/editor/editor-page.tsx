import {ThemeProvider} from "../../context/theme/theme-provider.tsx";
import {ChartDBProvider} from "../../context/chartdb/chartdb-provider.tsx";
import {ReactFlowProvider} from "@xyflow/react";
import {Canvas} from "../../section/canvas/canvas.tsx";
import {LocalConfigProvider} from "../../context/local-config/local-config-provider.tsx";
import {RelationshipList} from "../../section/panel/relationship-list.tsx";


export const EditorPage = () => (
  <LocalConfigProvider> {/*theme local storage*/}
    <ThemeProvider> {/*theme setting*/}
      <ChartDBProvider>
        <ReactFlowProvider>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <RelationshipList/>
            <Canvas/>
          </div>
        </ReactFlowProvider>
      </ChartDBProvider>
    </ThemeProvider>
  </LocalConfigProvider>
)
