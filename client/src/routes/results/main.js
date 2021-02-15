import * as d3 from "d3";
import {
  CSV_PATH,
  DOMAIN,
  DOMAIN_DISCREET,
  UNCERTAINTY,
  MARGIN,
  WIDTH,
  HEIGHT,
  ORIGIN,
  DOT_DIAMETER,
  DOT_OPACITY,
  ARROW_PATHS,
  RANGE_INPUTS,
  GRAPH_SELECT,
  COLOR_SELECT,
  getGraphType,
  getColorScheme,
  queryRangeInputs,
  queryVisualOptions,
  jitter,
  X_SELECT,
  Y_SELECT,
} from "./constants";

let parsedData; // will hold a copy after async d3 fetch & parse
let questions;

// events

RANGE_INPUTS.forEach((range) =>
  range.addEventListener("input", (e) =>
    updateDots(
      Object.assign(queryRangeInputs(), { [e.target.name]: e.target.value })
    )
  )
);
GRAPH_SELECT.addEventListener("change", () =>
  parsedData != null ? makeOriginalCharts() : null
);
COLOR_SELECT.addEventListener("change", () =>
  parsedData != null ? makeOriginalCharts() : null
);

[X_SELECT, Y_SELECT].forEach((select, i) => {
  select.addEventListener("change", (e) =>  {
    let q = [null, null];
    newCustomChart((q[i] = e.target.value, q))
  }
  );
});

function newCustomChart([x, y]) {
  const columns = getCustomColumns([x, y]);
  if (columns == null) return;
  eraseViz();
  makeSingleChart(columns);
}

function getCustomColumns([xQ, yQ] = []) {
  if (questions == null) return null;
  const x = xQ ?? X_SELECT.value;
  const y = yQ ?? Y_SELECT.value;
  if (x == "" || y == "") return null;
  return [questions[x], questions[y]];
}

const xScale = d3
  .scaleLinear()
  .domain(DOMAIN)
  .range([MARGIN.left, WIDTH - MARGIN.right]);
const yScale = d3
  .scaleLinear()
  .domain(DOMAIN)
  .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

const xBand = d3
  .scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([MARGIN.left, WIDTH - MARGIN.right]);
const yBand = d3
  .scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

// load & parse the data asynchronously
d3.csv(CSV_PATH, (d) => {
  // convert strings to numbers where appropriate
  const row = d;
  for (let col in row) {
    // skip "NA" values
    if (col !== "poll" && row[col] !== "NA") {
      row[col] = +row[col];
    }
  }
  return row;
}).then((data) => {
  // save in global variable
  parsedData = data;
  // save relevant column names
  questions = Object.keys(parsedData[0]).filter((q) => q != "poll");
  populateUserSelect(questions);

  // make the charts
  makeOriginalCharts(parsedData);
});

function makeOriginalCharts(data = parsedData, options) {
  if (options == null) options = queryVisualOptions();
  // clean slate
  eraseViz();
  // iterate pairwise
  for (let idx = 0; idx < questions.length; idx += 2) {
    const xy = [questions[idx], questions[idx + 1]];
    makeSingleChart(xy, data);
  }
}

function eraseViz() {
  d3.select(".container").selectAll("*").remove();
}

function makeSingleChart(
  columns,
  data = parsedData,
  { size = DOT_DIAMETER, opacity = DOT_OPACITY } = {}
) {
  // make new svg element
  const svg = d3
    .select(".container")
    .append("svg")
    .attr("viewBox", [0, 0, WIDTH, HEIGHT])
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  // draw data to it
  if (getGraphType() === "heatmap") {
    drawHeatMap(svg, columns, data);
  } else if (getGraphType() === "scatterplot") {
    drawScatterplot(svg, columns, data, { size, opacity });
  }

  // draw axes, columns
  const xAxis = (g) =>
    g
      .attr("transform", `translate(0, ${ORIGIN.y})`)
      .call(d3.axisBottom(xScale).ticks("").tickSizeOuter(0));

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${ORIGIN.x}, 0)`)
      .call(d3.axisLeft(yScale).ticks("").tickSizeOuter(0));

  const markers = (g) =>
    g
      .attr("stroke", "none")
      .attr("fill", "black")
      .selectAll("path")
      .data(ARROW_PATHS)
      .join("path")
      .attr(
        "d",
        (d) => `M${d[0]} ${d[1]} L ${d[2]} ${d[3]} L ${d[4]} ${d[5]} Z`
      );

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

  svg
    .append("text")
    .attr("class", "xlabel")
    .attr("x", WIDTH - MARGIN.right / 2)
    .attr("y", ORIGIN.y)
    .attr("text-anchor", "middle")
    .attr("transform", `rotate(90, ${WIDTH - MARGIN.right / 2}, ${ORIGIN.y})`)
    .text(columns[0]);
  svg
    .append("text")
    .attr("class", "ylabel")
    .attr("x", ORIGIN.x)
    .attr("y", MARGIN.top / 2)
    .attr("transform", `translate(-100)`)
    .text(columns[1]);

  svg.append("g").call(markers);
}

function drawScatterplot(
  svg,
  columns,
  data,
  { size = DOT_DIAMETER, opacity = DOT_OPACITY } = {}
) {
  // clean slate
  svg.selectAll(".graphcontent").remove();
  // append dots
  svg
    .append("g")
    .attr("stroke-width", size)
    .attr("stroke", "black")
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
    );
}

function updateDots({ size = DOT_DIAMETER, opacity = DOT_OPACITY } = {}) {
  d3.selectAll(".dot")
    .attr("stroke-width", size)
    .attr("stroke-opacity", opacity);
}

// heatmap
function drawHeatMap(svg, columns, data) {
  // calc heatmap values (totals answers per grid zone (UNCERTAINTY*2 by UNCERTAINTY*2))

  const heatmap = getHeatmapFrom(columns, data);

  let min = Infinity,
    mid,
    max = -Infinity;
  for (let { value } of heatmap) {
    let n = value;
    min = n < min ? n : min;
    max = n > max ? n : max;
  }
  mid = Math.round(max - min) / 2;
  const color = d3
    .scaleSequential(d3[getColorScheme()])
    .domain([min, mid, max]);

  svg.selectAll(".graphcontent").remove();
  // svg.append("rect")
  //   .attr("x", xScale(DOMAIN[0]))
  //   .attr("y", yScale(DOMAIN[1]))
  //   .attr("width", xBand.bandwidth() * (DOMAIN[1]-DOMAIN[0]))
  //   .attr("height", yBand.bandwidth() * (DOMAIN[1]-DOMAIN[0]))
  //   .attr("fill", color(min))
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
    .attr("stroke", (d) => color(d.value))
    .attr("fill", (d) => color(d.value));
}

const binValue = (n) => Math.floor(n);
const toPairStr = (xy) => `${binValue(xy[0])},${binValue(xy[1])}`;

function getHeatmapFrom(column, data) {
  const totals = {};
  for (let row of data) {
    const xValue = row[column[0]];
    const yValue = row[column[1]];
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

function populateUserSelect(options) {
  options.forEach((option, idx) => {
    [X_SELECT, Y_SELECT].forEach((select) => {
      const ele = document.createElement("option");
      ele.setAttribute("value", `${idx}`);
      ele.textContent = option;
      select.appendChild(ele);
    });
  });
}
