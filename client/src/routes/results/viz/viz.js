import { h } from "preact";
import { GRAPH_TYPE } from "../constants";
import style from "./style.css";

import Heatmap from "./components/heatmap/heatmap";
import Scatterplot from "./components/scatterplot/scatterplot";
import DensityScatterplot from "./components/density-scatterplot/density-scatterplot";

export function Viz({ data, columns, options, zRange, brushMap, callback }) {
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
          options={options}
          brushMap={brushMap}
          zRange={zRange}
          callback={callback}
        />
      );
      break;
    case GRAPH_TYPE.density:
      svg = (
        <DensityScatterplot
          data={data}
          columns={columns}
          options={options}
          brushMap={brushMap}
          zRange={zRange}
          callback={callback}
        />
      );
      break;
    default:
      svg = <span>nothing to display</span>;
  }
  return <div class={style.vizContainer}>{svg}</div>;
}
