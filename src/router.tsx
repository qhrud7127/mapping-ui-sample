import {createBrowserRouter, RouteObject} from "react-router-dom";


const routes: RouteObject[] = [
    ...['', 'diagrams/:diagramId'].map((path) => ({
        path,
        async lazy() {
            const { EditorPage } = await import(
                './pages/editor/editor-page.tsx'
            );

            return {
                element: <EditorPage />,
            };
        },
    })),
    {
        path: '*',
        async lazy() {
            const { EditorPage } = await import(
              './pages/editor/editor-page.tsx'
              );

            return {
                element: <EditorPage />,
            };
        },
    },
];

export const router = createBrowserRouter(routes);
