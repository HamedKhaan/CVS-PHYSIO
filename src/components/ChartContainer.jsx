import React, { useState } from "react";

const clampZoom = (value) => Math.min(2, Math.max(0.75, Number(value.toFixed(2))));

export default function ChartContainer({
  height = 260,
  children,
  style = {},
  showZoom = true,
}) {
  const [zoom, setZoom] = useState(1);

  const setZoomSafe = (value) => setZoom(clampZoom(value));
  const scaledHeight = Math.round(height * zoom);

  return (
    <div
      className="chart-frame"
      style={{
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        height: `${scaledHeight}px`,
        minHeight: `${scaledHeight}px`,
        position: "relative",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        ...style,
      }}
    >
      {showZoom && (
        <div className="chart-zoom-controls" role="group" aria-label="Chart zoom controls">
          <button
            type="button"
            className="chart-zoom-button"
            onClick={() => setZoomSafe(zoom - 0.25)}
            disabled={zoom <= 0.75}
            aria-label="Zoom out"
            title="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            className="chart-zoom-value"
            onClick={() => setZoomSafe(1)}
            aria-label="Reset chart zoom"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            className="chart-zoom-button"
            onClick={() => setZoomSafe(zoom + 0.25)}
            disabled={zoom >= 2}
            aria-label="Zoom in"
            title="Zoom in"
          >
            +
          </button>
        </div>
      )}

      <div
        className="chart-zoom-stage"
        style={{
          width: "100%",
          height: `${height}px`,
          minHeight: `${height}px`,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
