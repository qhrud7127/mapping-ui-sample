import {ThemeProvider} from "../../context/theme/theme-provider.tsx";
import {StorageProvider} from "../../context/storage/storage-provider.tsx";
import {ConfigProvider} from "../../context/config/config-provider.tsx";
import {ChartDBProvider} from "../../context/chartdb/chartdb-provider.tsx";
import {ReactFlowProvider} from "@xyflow/react";
import {Canvas} from "../../canvas/canvas.tsx";
import {LocalConfigProvider} from "../../context/local-config/local-config-provider.tsx";


export const EditorPage = () => (
  <LocalConfigProvider>
    <ThemeProvider>
      <StorageProvider>
        <ConfigProvider>
          <ChartDBProvider>
            <ReactFlowProvider>
              <Canvas/>
            </ReactFlowProvider>
          </ChartDBProvider>
        </ConfigProvider>
      </StorageProvider>
    </ThemeProvider>
  </LocalConfigProvider>
)
