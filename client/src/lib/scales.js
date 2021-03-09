import {
  DOMAIN,
  DOMAIN_DISCREET,
  MARGIN,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
} from "../constants";
import { scaleLinear, scaleBand } from "d3";

const xScale = scaleLinear()
  .domain(DOMAIN)
  .range([MARGIN.left, DEFAULT_CANVAS_WIDTH - MARGIN.right]);

const yScale = scaleLinear()
  .domain(DOMAIN)
  .range([DEFAULT_CANVAS_HEIGHT - MARGIN.bottom, MARGIN.top]);

//heatmap
const xBand = scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([MARGIN.left, DEFAULT_CANVAS_WIDTH - MARGIN.right]);
const yBand = scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([DEFAULT_CANVAS_HEIGHT - MARGIN.bottom, MARGIN.top]);

export { xScale, yScale, xBand, yBand };
