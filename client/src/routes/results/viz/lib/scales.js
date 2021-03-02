import * as d3 from "d3";
import {
  DOMAIN,
  DOMAIN_DISCREET,
  AXES_DOMAIN,
  MARGIN,
  ORIGIN,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  ARROW_PATHS,
} from "../../constants";

export const xScale = d3
  .scaleLinear()
  .domain(DOMAIN)
  .range([MARGIN.left, DEFAULT_CANVAS_WIDTH - MARGIN.right]);

export const yScale = d3
  .scaleLinear()
  .domain(DOMAIN)
  .range([DEFAULT_CANVAS_HEIGHT - MARGIN.bottom, MARGIN.top]);

export const zScale = d3
  .scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([xScale(AXES_DOMAIN[0]), xScale(AXES_DOMAIN[1])]);

export const xAxisScale = d3
  .scaleLinear(AXES_DOMAIN)
  .range([xScale(AXES_DOMAIN[0]), xScale(AXES_DOMAIN[1])]);

export const yAxisScale = d3
  .scaleLinear(AXES_DOMAIN)
  .range([yScale(AXES_DOMAIN[1]), yScale(AXES_DOMAIN[0])]);

const scaledArrowTips = [
  [ORIGIN.x, yScale(AXES_DOMAIN[1])],
  [xScale(AXES_DOMAIN[1]), ORIGIN.y],
  [ORIGIN.x, yScale(AXES_DOMAIN[0])],
  [xScale(AXES_DOMAIN[0]), ORIGIN.y],
];

export const arrowheadPaths = g =>
g
  .attr("stroke", "none")
  .attr("fill", "#444")
  .selectAll("path")
  .data(ARROW_PATHS(scaledArrowTips))
  .join("path")
  .attr("d", d => `M${d[0]} ${d[1]} L ${d[2]} ${d[3]} L ${d[4]} ${d[5]} Z`);

//heatmap
export const xBand = d3
  .scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([MARGIN.left, DEFAULT_CANVAS_WIDTH - MARGIN.right]);
export const yBand = d3
  .scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([DEFAULT_CANVAS_HEIGHT - MARGIN.bottom, MARGIN.top]);