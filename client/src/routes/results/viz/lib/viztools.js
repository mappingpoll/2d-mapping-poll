import * as d3 from "d3";
import { DOMAIN, NA_SYMBOL } from "../../constants"



export function isValidDatum(datum, columns) {
  return columns.every(c => datum[c] !== NA_SYMBOL);
}


export function getColorScale(color, domain, k) {
  const mid = (domain[1] - domain[0]) * k;
  return d3.scaleSequential(d3[color]).domain([domain[0], mid, domain[1]]);
}


export function calcHeatmap(data, columns) {
  const totals = {};
  const binValue = n => Math.floor(n);
  const toPairStr = (x, y) => `${binValue(x)},${binValue(y)}`;

  for (let row of data) {  
    const xValue = row[columns[0]];
    const yValue = row[columns[1]];
    if (xValue === NA_SYMBOL || yValue === NA_SYMBOL)
      continue;
    const coord = toPairStr(xValue, yValue);
    if (totals[coord] == null)
      totals[coord] = 0;
    totals[coord] += 1;
  }
  /* for (let total in totals) {
    const [x, y] = total.split(",").map(t => +t);
    heatmap.push({ x, y, value: totals[total] });
  } */
  const heatmap = [];
  for (let y = DOMAIN[0]; y <= DOMAIN[1]; y++) {
    heatmap[y] = [];
    for (let x = DOMAIN[0]; x <= DOMAIN[1]; x++) {
      const pair = toPairStr(x, y);
      heatmap[y][x] = totals[pair] ?? 0;
    }
  }
  return heatmap;
}
