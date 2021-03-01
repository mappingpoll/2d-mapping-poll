import { h } from "preact";
import { GRAPH_TYPE } from "../constants";
import style from "./style.css";

import Heatmap from "./components/heatmap/heatmap";
import Scatterplot from "./components/scatterplot/scatterplot";

export function Viz({ data, columns, options }) {
  let svg;
  switch (options.graph) {
    case GRAPH_TYPE.heatmap:
      svg = <Heatmap data={data} columns={columns} options={options} />;
      break;
    case GRAPH_TYPE.scatterplot:
      svg = <Scatterplot data={data} columns={columns} options={options} />;
      break;
    default:
      svg = <span>nothing to display</span>;
  }
  return <div class={style.vizContainer}>{svg}</div>;
}
