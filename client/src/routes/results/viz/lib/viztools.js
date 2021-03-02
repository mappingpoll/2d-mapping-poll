import * as d3 from "d3";
import { CUSTOM_COLORS, DOMAIN, NA_SYMBOL } from "../../constants";
import { symFloor } from "./misc";

export function isValidDatum(datum, columns) {
  if (columns instanceof Array !== true) columns = [columns];
  return columns.every(c => datum[c] !== NA_SYMBOL);
}

export function getColorScale(color, domain, k) {
  const mid = (domain[1] - domain[0]) * k;
  let colScale;
  if (CUSTOM_COLORS[color] == null)
    colScale = d3
      .scaleSequential(d3[color])
      .domain([domain[0], mid, domain[1]]);
  else
    colScale = d3
      .scaleSequential()
      .domain([domain[0], mid, domain[1]])
      .range(CUSTOM_COLORS[color]);
  return colScale;
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
