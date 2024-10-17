import {ThemeProvider} from "../../context/theme/theme-provider.tsx";
import {LayoutProvider} from "../../context/layout/layout-provider.tsx";
import {StorageProvider} from "../../context/storage/storage-provider.tsx";
import {ConfigProvider} from "../../context/config/config-provider.tsx";
import {RedoUndoStackProvider} from "../../context/history/redo-undo-stack-provider.tsx";
import {ChartDBProvider} from "../../context/chartdb/chartdb-provider.tsx";
import {HistoryProvider} from "../../context/history/history-provider.tsx";
import {ReactFlowProvider} from "@xyflow/react";
import {Canvas} from "../../canvas/canvas.tsx";
import {LocalConfigProvider} from "../../context/local-config/local-config-provider.tsx";


export const EditorPage = () => (
  <LocalConfigProvider>
    <ThemeProvider>
      <LayoutProvider>
        <StorageProvider>
          <ConfigProvider>
            <RedoUndoStackProvider>
              <ChartDBProvider>
                <HistoryProvider>
                  <ReactFlowProvider>
                    <Canvas/>
                  </ReactFlowProvider>
                </HistoryProvider>
              </ChartDBProvider>
            </RedoUndoStackProvider>
          </ConfigProvider>
        </StorageProvider>
      </LayoutProvider>
    </ThemeProvider>
  </LocalConfigProvider>
)
