import * as d3 from "d3";
import { h } from "preact";
import { Text } from "preact-i18n";
import { questions } from "../../../i18n/fr.json";

import {
  DOMAIN,
  DOMAIN_DISCREET,
  UNCERTAINTY,
  MARGIN,
  ORIGIN,
  ARROW_PATHS,
  jitter,
  GRAPH_TYPE,
  DEFAULT_COLOR,
  AXES_DOMAIN,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_DOT_SIZE,
  DEFAULT_DOT_OPACITY,
  DEFAULT_COLOR_MID,
} from "../constants";

const xScale = d3
  .scaleLinear()
  .domain(DOMAIN)
  .range([MARGIN.left, DEFAULT_CANVAS_WIDTH - MARGIN.right]);
const yScale = d3
  .scaleLinear()
  .domain(DOMAIN)
  .range([DEFAULT_CANVAS_HEIGHT - MARGIN.bottom, MARGIN.top]);

const xAxisScale = d3
  .scaleLinear(AXES_DOMAIN)
  .range([xScale(AXES_DOMAIN[0]), xScale(AXES_DOMAIN[1])]);
const yAxisScale = d3
  .scaleLinear(AXES_DOMAIN)
  .range([yScale(AXES_DOMAIN[1]), yScale(AXES_DOMAIN[0])]);

const xBand = d3
  .scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([MARGIN.left, DEFAULT_CANVAS_WIDTH - MARGIN.right]);
const yBand = d3
  .scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([DEFAULT_CANVAS_HEIGHT - MARGIN.bottom, MARGIN.top]);

const ARROW_TIPS = [
  [ORIGIN.x, yScale(AXES_DOMAIN[1])],
  [xScale(AXES_DOMAIN[1]), ORIGIN.y],
  [ORIGIN.x, yScale(AXES_DOMAIN[0])],
  [xScale(AXES_DOMAIN[0]), ORIGIN.y],
];

const arrows = ARROW_PATHS(ARROW_TIPS);

function Graph(
  data,
  columns,
  {
    size = DEFAULT_DOT_SIZE,
    opacity = DEFAULT_DOT_OPACITY,
    graph = GRAPH_TYPE.scatterplot,
    color = DEFAULT_COLOR,
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

  // draw data to it
  if (graph === GRAPH_TYPE.heatmap) {
    drawHeatMap(svg, data, columns, { color, k });
  } else if (graph === GRAPH_TYPE.scatterplot) {
    drawScatterplot(svg, data, columns, { size, opacity, color, k });
  }

  // draw axes, columns
  const xAxis = (g) =>
    g
      .attr("transform", `translate(0, ${ORIGIN.y})`)
      .call(d3.axisBottom(xAxisScale).ticks("").tickSizeOuter(0));

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${ORIGIN.x}, 0)`)
      .call(d3.axisLeft(yAxisScale).ticks("").tickSizeOuter(0));

  const markers = (g) =>
    g
      .attr("stroke", "none")
      .attr("fill", "#444")
      .selectAll("path")
      .data(arrows)
      .join("path")
      .attr(
        "d",
        (d) => `M${d[0]} ${d[1]} L ${d[2]} ${d[3]} L ${d[4]} ${d[5]} Z`
      );

  svg.append("g").call(markers);
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
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
    </div>
  );
}

function getMid(domain, k) {
  return (domain[1] - domain[0]) * k;
}

function getColorScale(color, domain, k) {
  const mid = getMid(domain, k);
  return d3.scaleSequential(d3[color]).domain([domain[0], mid, domain[1]]);
}

function drawScatterplot(
  svg,
  data,
  columns,
  {
    size = DEFAULT_DOT_SIZE,
    opacity = DEFAULT_DOT_OPACITY,
    color = DEFAULT_COLOR,
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
    .data(data.filter((d) => d[columns[0]] !== "NA" && d[columns[1]] !== "NA"))
    .join("path")
    .attr("class", "dot graphcontent")
    // apply jitter
    .attr(
      "d",
      (d) =>
        `M${xScale(d[columns[0]] + jitter())}, ${yScale(
          d[columns[1]] + jitter()
        )}h0`
    )
    // color, if any
    .attr(
      "stroke",
      hasColorDimension ? (d) => colorScale(d[columns[2]]) : "black"
    );
}
// heatmap
function drawHeatMap(svg, data, columns, options) {
  // calc heatmap values (totals answers per grid zone (UNCERTAINTY*2 by UNCERTAINTY*2))
  const heatmap = getHeatmapFrom(data, columns);
  let min = Infinity,
    max = -Infinity;
  for (let { value } of heatmap) {
    let n = value;
    min = n < min ? n : min;
    max = n > max ? n : max;
  }
  const colorScale = getColorScale(options.color, [min, max], options.k);

  svg.selectAll(".graphcontent").remove();
  svg
    .append("g")
    .attr("stroke-width", "1.5")
    .selectAll("rect")
    .data(heatmap)
    .join("rect")
    .attr("class", "rect graphcontent")
    .attr("x", (d) => xScale(d.x - UNCERTAINTY))
    .attr("y", (d) => yScale(d.y + UNCERTAINTY))
    .attr("width", xBand.bandwidth())
    .attr("height", yBand.bandwidth())
    .attr("stroke", (d) => colorScale(d.value))
    .attr("fill", (d) => colorScale(d.value));
}
const binValue = (n) => Math.floor(n);
const toPairStr = (xy) => `${binValue(xy[0])},${binValue(xy[1])}`;
function getHeatmapFrom(data, columns) {
  const totals = {};
  for (let row of data) {
    const xValue = row[columns[0]];
    const yValue = row[columns[1]];
    if (xValue === "NA" || yValue === "NA") continue;
    const coord = toPairStr([xValue, yValue]);
    if (totals[coord] == null) totals[coord] = 0;
    totals[coord] += 1;
  }
  const heatmap = [];
  for (let total in totals) {
    const [x, y] = total.split(",").map((t) => +t);
    heatmap.push({ x, y, value: totals[total] });
  }
  return heatmap;
}

// modify in place
function updateDotSize(size) {
  d3.selectAll(".dot").attr("stroke-width", size);
}

function updateDotOpacity(opacity) {
  d3.selectAll(".dot").attr("stroke-opacity", opacity);
}

function updateDotK(k, state) {
  const { data, column, color } = state;
  const colorScale = getColorScale(color, DOMAIN, k);
  d3.selectAll(".dot")
    .data(data.filter((d) => d[column] !== "NA"))
    .attr("stroke", (d) => colorScale(d[column]));
}


// API

export function newChartsCollection(data, questions, options) {
  let charts = [];
  // iterate pairwise
  for (let idx = 0; idx < questions.length; idx += 2) {
    const columns = [questions[idx], questions[idx + 1]];
    charts.push(Graph(data, columns, options));
  }
  return charts;
}

export function newCustomChart(data, columns, options) {
  return Graph(data, columns, options);
}

export function updateDotAppearance(options, { data, column, color } = {}) {
  const { size, opacity, k } = options;
  if (size != null) updateDotSize(size);
  if (opacity != null) updateDotOpacity(opacity);
  if (k != null) updateDotK(k, { data, column, color });
}

export function removeDotColorsSingleChart() {
  d3.selectAll(".dot").attr("stroke", "black");
}


export function newGraphs(data, columns, options) {
  const shouldShowCustomChart = (columns) => columns.length <= 3;
  if (shouldShowCustomChart(columns))
    return newCustomChart(data, columns, options);
  return newChartsCollection(data, columns, options);
}
