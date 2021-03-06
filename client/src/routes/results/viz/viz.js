import { h } from "preact";
import { GRAPH_TYPE } from "../constants";

import Heatmap from "./components/heatmap/heatmap";
import Scatterplot from "./components/scatterplot/scatterplot";
import DensityScatterplot from "./components/density-scatterplot/density-scatterplot";
import ContourChart from "./components/contour/contour";
import ContourScatterplot from "./components/contour-scatterplot/contour-scatterplot";
import ColorContour from "./components/color-contour/color-contour";

import { questions } from "../../../i18n/fr.json";
import style from "./style.css";
import { Text } from "preact-i18n";

export function Viz({ state, columns, callback }) {
  const { data, colorScale, options, brushMap } = state;
  if (columns == null) columns = state.columns;

  let [x, y] = columns;
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
          callback={callback}
        />
      );
      break;
    case GRAPH_TYPE.contour:
      svg = (
        <ContourChart
          data={data}
          columns={columns}
          colorScale={colorScale}
          options={options}
        />
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

      <div class={`${style.label} ${style.right}`}>
        <Text id={`questions.${x}.fr.end`}>{questions[x].en.end}</Text>
      </div>
      <div class={`${style.label} ${style.left}`}>
        <Text id={`questions.${x}.fr.start`}>{questions[x].en.start}</Text>
      </div>
      <div class={`${style.label} ${style.bottom}`}>
        <Text id={`questions.${y}.fr.start`}>{questions[y].en.start}</Text>
      </div>
      <div class={`${style.label} ${style.top}`}>
        <Text id={`questions.${y}.fr.end`}>{questions[y].en.end}</Text>
      </div>
    </div>
  );
}
