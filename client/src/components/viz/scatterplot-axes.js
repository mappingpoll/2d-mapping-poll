import * as d3 from "d3";
import { xScale, yScale } from "../../lib/scales";
import { ORIGIN, AXES_DOMAIN } from "../../constants";
import style from "./scatterplot-axes.css";
import { useD3 } from "../../hooks/useD3";

const xAxisScale = d3
  .scaleLinear(AXES_DOMAIN)
  .range([xScale(AXES_DOMAIN[0]), xScale(AXES_DOMAIN[1])]);

const yAxisScale = d3
  .scaleLinear(AXES_DOMAIN)
  .range([yScale(AXES_DOMAIN[1]), yScale(AXES_DOMAIN[0])]);

export const xAxis = g =>
  g
    .attr("transform", `translate(0, ${ORIGIN.y})`)
    .attr("class", style.axis)
    .call(d3.axisBottom(xAxisScale).ticks("").tickSizeOuter(0));

export const yAxis = g =>
  g
    .attr("transform", `translate(${ORIGIN.x}, 0)`)
    .attr("class", style.axis)
    .call(d3.axisLeft(yAxisScale).ticks("").tickSizeOuter(0));

const ARROW_LENGTH = 24;
const ARROW_FEATHER_SIZE = 8;
// arrowheads
const CARDINAL_MATRICES = [
  [
    [
      [1, 0],
      [0, 1],
    ],
    [
      [-1, 0],
      [0, 1],
    ],
  ],
  [
    [
      [0, -1],
      [1, 0],
    ],
    [
      [0, -1],
      [-1, 0],
    ],
  ],
  [
    [
      [-1, 0],
      [0, -1],
    ],
    [
      [1, 0],
      [0, -1],
    ],
  ],
  [
    [
      [0, 1],
      [-1, 0],
    ],
    [
      [0, 1],
      [1, 0],
    ],
  ],
];

const scaledArrowTips = [
  [ORIGIN.x, yScale(AXES_DOMAIN[1]) - ARROW_LENGTH],
  [xScale(AXES_DOMAIN[1]) + ARROW_LENGTH, ORIGIN.y],
  [ORIGIN.x, yScale(AXES_DOMAIN[0]) + ARROW_LENGTH],
  [xScale(AXES_DOMAIN[0]) - ARROW_LENGTH, ORIGIN.y],
];

export const ARROW_PATHS = scaledArrowTips.map((arrow, i) => {
  let v1, v2;
  const translate = n => (p, j) =>
    p +
    CARDINAL_MATRICES[i][n][j][0] * ARROW_FEATHER_SIZE +
    CARDINAL_MATRICES[i][n][j][1] * ARROW_LENGTH;
  v1 = arrow.map(translate(0));
  v2 = arrow.map(translate(1));
  return [...arrow, ...v1, ...v2];
});

export const arrowheads = g => {
  g.attr("class", style.arrowhead)
    .selectAll("path")
    .data(ARROW_PATHS)
    .join("path")
    .attr("d", d => `M${d[0]} ${d[1]} L ${d[2]} ${d[3]} L ${d[4]} ${d[5]} Z`);
};
// export const zAxis = colorScale => g =>
//   g
//     .attr("class", "zaxis")
//     .attr("transform", `translate(0, ${DEFAULT_CANVAS_HEIGHT - TRACK_HEIGHT})`)
//     .selectAll("rect")
//     .data(DOMAIN_DISCREET)
//     .join("rect")
//     .attr("x", d => zScale(d))
//     .attr("width", zScale.bandwidth())
//     .attr("height", TRACK_HEIGHT)
//     .attr("stroke", d => colorScale(d))
//     .attr("fill", d => colorScale(d));

export function appendAxes(svg) {
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  svg.append("g").call(arrowheads);
}

export function Axes(props) {
  const ref = useD3(svg => appendAxes(svg));
  return (
    <svg
      ref={ref}
      class={props.class}
      style={props.style}
      width={props.width}
      height={props.height}
      viewBox={`0, 0, ${props.width}, ${props.height}`}
    />
  );
}
