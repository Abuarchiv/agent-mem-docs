// Browser bundle for scripts/render-diagrams.ts: turns a diagram skeleton into
// Excalidraw elements and exports them with Excalidraw's own SVG renderer.
import { convertToExcalidrawElements, exportToSvg } from "@excalidraw/excalidraw";

declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH: string;
    render: (skeleton: unknown[]) => Promise<{ elements: unknown[]; svg: string }>;
  }
}

window.render = async (skeleton) => {
  const elements = convertToExcalidrawElements(skeleton as never, { regenerateIds: false });
  const svg = await exportToSvg({
    elements,
    appState: { exportBackground: false, exportPadding: 16 },
    files: null,
  });
  return { elements, svg: svg.outerHTML };
};
