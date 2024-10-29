import {createBrowserRouter, RouteObject} from "react-router-dom";


const routes: RouteObject[] = [
  {
    path: '*',
    async lazy() {
      const {EditorPage} = await import(
        './pages/editor/editor-page.tsx'
        );

      return {
        element: <EditorPage/>,
      };
    },
  },
];

export const router = createBrowserRouter(routes);
