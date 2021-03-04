import * as d3 from "d3";
import {
  CUSTOM_COLORS,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  DOMAIN,
  NA_SYMBOL,
} from "../../constants";
import { symFloor } from "./misc";
// import { xAxis, yAxis } from "./scatterplot-axes";
import svgExport from "./svg-export";

export function isValidDatum(datum, columns) {
  if (columns instanceof Array !== true) columns = [columns];
  return columns.every(c => datum[c] !== NA_SYMBOL);
}

export function getColorScale(color, domain, rev = false) {
  if (rev) domain = [domain[1], domain[0]];
  let colorScale;
  if (CUSTOM_COLORS[color] == null)
    colorScale = d3.scaleSequential(d3[color]).domain(domain);
  else colorScale = d3.scaleSequential(CUSTOM_COLORS[color]).domain(domain);
  return colorScale;
}

export function calcHeatmap(data, columns) {
  const heatmap = [];
  const totals = {};

  const toPairStr = (x, y) => `${x},${y}`;

  // calc totals in data
  for (let datum of data) {
    if (!isValidDatum(datum, columns)) continue;
    const xValue = symFloor(datum[columns[0]]);
    const yValue = symFloor(datum[columns[1]]);
    const pair = toPairStr(xValue, yValue);
    if (totals[pair] == null) totals[pair] = 0;
    else totals[pair] += 1;
  }
  // format totals into array
  for (let pair in totals) {
    const [x, y] = pair.split(",").map(t => +t);
    heatmap.push({ x, y, value: totals[pair] });
  }
  // iterate over domain to include dataless coords as 0 values
  for (let y = DOMAIN[0]; y <= DOMAIN[1]; y++) {
    for (let x = DOMAIN[0]; x <= DOMAIN[1]; x++) {
      const pair = toPairStr(x, y);
      if (totals[pair] == null) heatmap.push({ x, y, value: 0 });
    }
  }
  return heatmap;
}

export function saveSVG(id) {
  svgExport.downloadSvg(document.querySelector(`#${id}`).firstChild, "viz");
}

export function makeBrushTool(emit) {
  return d3
    .brush()
    .extent([
      [0, 0],
      [DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT],
    ])
    .on("end", emit);
}

export function isBrushed(extent, x, y) {
  const x0 = extent[0][0],
    y0 = extent[0][1],
    x1 = extent[1][0],
    y1 = extent[1][1];

  return x0 <= x && x <= x1 && y0 <= y && y <= y1;
}

// export function appendStandardAxes(svg) {
//   svg.append("g").call(arrowheadPaths);
//   svg.append("g").call(xAxis);
//   svg.append("g").call(yAxis);
// }
