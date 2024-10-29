import {ThemeProvider} from "../../context/theme/theme-provider.tsx";
import {ChartDBProvider} from "../../context/chartdb/chartdb-provider.tsx";
import {ReactFlowProvider} from "@xyflow/react";
import {Canvas} from "../../section/canvas/canvas.tsx";
import {LocalConfigProvider} from "../../context/local-config/local-config-provider.tsx";
import {RelationshipList} from "../../section/panel/relationship-list.tsx";
import {DialogProvider} from "../../context/dialog/dialog-provider.tsx";
import client from "../../../apollo-client.ts";
import {ApolloProvider} from "@apollo/client";


export const EditorPage = () => (
  <LocalConfigProvider> {/*theme local storage*/}
    <ThemeProvider> {/*theme setting*/}
      <ChartDBProvider>
        <ReactFlowProvider>
          <DialogProvider>
            <ApolloProvider client={client}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <RelationshipList/>
                <Canvas/>
              </div>
            </ApolloProvider>
          </DialogProvider>
        </ReactFlowProvider>
      </ChartDBProvider>
    </ThemeProvider>
  </LocalConfigProvider>
)
