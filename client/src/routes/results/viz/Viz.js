import * as d3 from "d3";
import { h } from "preact";
import { Text } from "preact-i18n";
import { questions } from "../../../i18n/fr.json";
import { getColorScale, isValidDatum } from "./lib/viztools";

import {
  DOMAIN,
  GRAPH_TYPE,
  DEFAULT_COLOR_SCHEME,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_DOT_SIZE,
  DEFAULT_DOT_OPACITY,
  DEFAULT_COLOR_MID,
  DEFAULT_DOT_COLOR,
} from "../constants";

import { xScale, yScale, arrowheadPaths } from "./lib/scales";
import { xAxis, yAxis, zAxis } from "./components/scatterplot/scatterplot-axes";
import { drawHeatmap } from "./components/heatmap/heatmap";


export function Viz(
  data,
  columns,
  {
    size = DEFAULT_DOT_SIZE,
    opacity = DEFAULT_DOT_OPACITY,
    graph = GRAPH_TYPE.scatterplot,
    color = DEFAULT_COLOR_SCHEME,
    k = DEFAULT_COLOR_MID,
  } = {}
) {
  const viz = d3.create("div");

  // make new svg element
  const svg = viz
    .append("svg")
    .attr("class", "viz")
    .attr("viewBox", [0, 0, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT])
    .attr("width", DEFAULT_CANVAS_WIDTH)
    .attr("height", DEFAULT_CANVAS_HEIGHT);

  if (graph === GRAPH_TYPE.heatmap) {
    // drawHeatMap(svg, data, columns, { color, k });
    drawHeatmap(svg, data, columns, { size, opacity, color, k });
  } else if (graph === GRAPH_TYPE.scatterplot) {
    drawScatterplot(svg, data, columns, { size, opacity, color, k });
  }
  const hasColorDimension = columns.length === 3;
  return (
    <div class="viz-container" innerHTML={viz.html()}>
      <div class="label left">
        <Text id={`questions.${columns[0]}.fr.start`}>
          {questions[columns[0]].en.start}
        </Text>
      </div>
      <div class="label right">
        <Text id={`questions.${columns[0]}.fr.end`}>
          {questions[columns[0]].en.end}
        </Text>
      </div>
      <div class="label bottom">
        <Text id={`questions.${columns[1]}.fr.start`}>
          {questions[columns[1]].en.start}
        </Text>
      </div>
      <div class="label top">
        <Text id={`questions.${columns[1]}.fr.end`}>
          {questions[columns[1]].en.end}
        </Text>
      </div>
      {hasColorDimension && (
        <>
          <div class="label zleft">
            <Text id={`questions.${columns[2]}.fr.start`}>
              {questions[columns[2]].en.start}
            </Text>
          </div>
          <div class="label zright">
            <Text id={`questions.${columns[2]}.fr.end`}>
              {questions[columns[2]].en.end}
            </Text>
          </div>
        </>
      )}
    </div>
  );
}

function dotId(_, i) {
  return `dot-${i}`;
}

function drawScatterplot(
  svg,
  data,
  columns,
  {
    size = DEFAULT_DOT_SIZE,
    opacity = DEFAULT_DOT_OPACITY,
    color = DEFAULT_COLOR_SCHEME,
    k = DEFAULT_COLOR_MID,
  } = {}
) {
  const hasColorDimension = columns.length === 3;

  let colorScale;
  if (hasColorDimension) {
    colorScale = getColorScale(color, DOMAIN, k);
  }

  // clean slate
  svg.selectAll(".graphcontent").remove();
  // append dots
  svg
    .append("g")
    .attr("stroke-width", size)
    .attr("stroke-opacity", opacity)
    .attr("stroke-linecap", "round")
    .selectAll("path")
    // filter out NAs
    .data(data.filter(d => isValidDatum(d, columns)))
    .join("path")
    .attr("class", "dot graphcontent")
    .attr("id", dotId)
    .attr("d", d => `M${xScale(d[columns[0]])}, ${yScale(d[columns[1]])}h0`)
    // color, if any
    .attr(
      "stroke",
      hasColorDimension ? d => colorScale(d[columns[2]]) : DEFAULT_DOT_COLOR
    );

  // draw axes, columns
  svg.append("g").call(arrowheadPaths);
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  if (hasColorDimension) svg.append("g").call(zAxis(colorScale));
}

