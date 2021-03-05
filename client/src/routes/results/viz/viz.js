import { h } from "preact";
import { GRAPH_TYPE } from "../constants";
import style from "./style.css";

import Heatmap from "./components/heatmap/heatmap";
import Scatterplot from "./components/scatterplot/scatterplot";
import DensityScatterplot from "./components/density-scatterplot/density-scatterplot";
import ContourChart from "./components/contour/contour";
import ContourScatterplot from "./components/contour-scatterplot/contour-scatterplot";
import ColorContour from "./components/color-contour/color-contour";

export function Viz({ state, columns, isMobile, callback }) {
  // let id = `viz-${Math.trunc(Math.random() * 1000000)}`;
  const { data, colorScale, options, brushMap } = state;
  if (columns == null) columns = state.columns;

  let svg;
  switch (options.graph) {
    case GRAPH_TYPE.heatmap:
      svg = <Heatmap data={data} columns={columns} options={options} />;
      break;
    case GRAPH_TYPE.scatterplot:
      svg = (
        <Scatterplot
          data={data}
          columns={columns}
          colorScale={colorScale}
          options={options}
          brushMap={brushMap}
          isMobile={isMobile}
          callback={callback}
        />
      );
      break;
    case GRAPH_TYPE.contourScatterplot:
      svg = (
        <ContourScatterplot
          data={data}
          columns={columns}
          colorScale={colorScale}
          options={options}
          brushMap={brushMap}
          isMobile={isMobile}
          callback={callback}
        />
      );
      break;
    case GRAPH_TYPE.density:
      svg = (
        <DensityScatterplot
          data={data}
          columns={columns}
          colorScale={colorScale}
          options={options}
          brushMap={brushMap}
          isMobile={isMobile}
          callback={callback}
        />
      );
      break;
    case GRAPH_TYPE.contour:
      svg = (
        <ContourChart data={data} columns={columns} colorScale={colorScale} />
      );
      break;
    case GRAPH_TYPE.colorContour:
      svg = (
        <ColorContour
          data={data}
          columns={columns}
          colorScale={colorScale}
          options={options}
        />
      );
      break;
    default:
      svg = <span>nothing to display</span>;
  }

  return (
    <div class={style.vizContainer}>
      {svg}
      {/* <button type="button" class={style.savebtn} onclick={() => saveSVG(id)}>
        <Text id="results.savebtn">Download image</Text>
      </button> */}
    </div>
  );
}
