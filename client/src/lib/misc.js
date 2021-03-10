import { GRAPH_TYPE } from "../constants";
import ColorContour from "../components/viz/color-contour";
import ContourChart from "../components/viz/contour";
import ContourScatterplot from "../components/viz/contour-scatterplot";
import DensityScatterplot from "../components/viz/density-scatterplot";
import Heatmap from "../components/viz/heatmap";
import Scatterplot from "../components/viz/scatterplot";

export const isChosenAxis = a => a != "";

export const hasXAxis = ({ x }) => isChosenAxis(x);

export const hasXYAxes = ({ x, y }) => isChosenAxis(x) && isChosenAxis(y);

export const hasThreeAxes = ({ x, y, z }) =>
  isChosenAxis(x) && isChosenAxis(y) && isChosenAxis(z);

export const canShowCustomViz = axes => hasXYAxes(axes);

// "symetrical" floor fn
export function symFloor(n) {
  return (n / Math.abs(n)) * Math.floor(Math.abs(n));
}

export function clamp(n, min, max) {
  if (min > max) min = max;
  if (max < min) max = min;
  return n <= min ? min : n >= max ? max : n;
}

export function rangeSize(range) {
  return Math.abs(Math.max(...range) - Math.min(...range));
}

export function graphType2Component(graphType) {
  switch (graphType) {
    case GRAPH_TYPE.heatmap:
      return Heatmap;
    case GRAPH_TYPE.scatterplot:
      return Scatterplot;
    case GRAPH_TYPE.contourScatterplot:
      return ContourScatterplot;
    case GRAPH_TYPE.density:
      return DensityScatterplot;
    case GRAPH_TYPE.contour:
      return ContourChart;
    case GRAPH_TYPE.colorContour:
      return ColorContour;
    default: {
      const Fallback = () => <span>nothing to display</span>;
      return Fallback;
    }
  }
}
