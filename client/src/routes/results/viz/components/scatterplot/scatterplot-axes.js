import * as d3 from "d3";
import { zScale, xAxisScale, yAxisScale } from "../../lib/scales";
import {
  DOMAIN_DISCREET,
  DEFAULT_CANVAS_HEIGHT,
  TRACK_HEIGHT,
  ORIGIN,
} from "../../../constants";

export const xAxis = g =>
  g
    .attr("transform", `translate(0, ${ORIGIN.y})`)
    .call(d3.axisBottom(xAxisScale).ticks("").tickSizeOuter(0));

export const yAxis = g =>
  g
    .attr("transform", `translate(${ORIGIN.x}, 0)`)
    .call(d3.axisLeft(yAxisScale).ticks("").tickSizeOuter(0));

export const zAxis = colorScale => g =>
  g
    .attr("class", "zaxis")
    .attr("transform", `translate(0, ${DEFAULT_CANVAS_HEIGHT - TRACK_HEIGHT})`)
    .selectAll("rect")
    .data(DOMAIN_DISCREET)
    .join("rect")
    .attr("x", d => zScale(d))
    .attr("width", zScale.bandwidth())
    .attr("height", TRACK_HEIGHT)
    .attr("stroke", d => colorScale(d))
    .attr("fill", d => colorScale(d));
