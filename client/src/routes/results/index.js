import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import style from "./style.css";
import { Text } from "preact-i18n";

import * as d3 from "d3";
import {
  CSV_PATH,
  DEFAULT_DOT_SIZE,
  DEFAULT_DOT_OPACITY,
  COLOR,
  DEFAULT_GRAPH_TYPE,
  DEFAULT_COLOR,
  GRAPH_TYPE,
} from "./constants";

import { makeOriginalCharts, updateDots, newCustomChart } from "./viz";

const Results = () => {
  let [dotSize, setDotSize] = useState(DEFAULT_DOT_SIZE);
  let [dotOpacity, setDotOpacity] = useState(DEFAULT_DOT_OPACITY);
  let [data, setData] = useState(null);
  let [questions, setQuestions] = useState(null);
  let [graphType, setGraphType] = useState(DEFAULT_GRAPH_TYPE);
  let [xSelect, setXSelect] = useState("");
  let [ySelect, setYSelect] = useState("");
  let [colorSelect, setColorSelect] = useState(DEFAULT_COLOR);

  // load & parse the result data asynchronously
  async function parseLocalCSV() {
    await d3
      .csv(CSV_PATH, (d) => {
        // convert strings to numbers where appropriate
        const row = d;
        for (let col in row) {
          // skip "NA" values
          if (col !== "poll" && row[col] !== "NA") {
            row[col] = +row[col];
          }
        }
        return row;
      })
      .then((data) => {
        console.log("csv loaded");
        // save in global variable
        setData(data);
        // save relevant column names
        const qs = Object.keys(data[0]).filter((q) => q != "poll");
        setQuestions(qs);
        makeOriginalCharts(data, qs, {
          size: dotSize,
          opacity: dotOpacity,
          graph: graphType,
        });
      });
  }
  useEffect(() => {
    if (data == null) parseLocalCSV();
  });

  function handleSettingChange(stateFn, renderFn) {
    return function (event) {
      event.preventDefault();
      const value = event.target.value;
      if (stateFn != null) stateFn(value);
      if (renderFn != null) renderFn(value);
    };
  }

  const handleDotSizeInput = handleSettingChange(setDotSize, (value) =>
    updateDots({ size: value })
  );
  const handleDotOpacityInput = handleSettingChange(setDotOpacity, (value) =>
    updateDots({ opacity: value })
  );
  const handleGraphTypeChange = handleSettingChange(setGraphType, (value) =>
    makeOriginalCharts(data, questions, getOptions({ graph: value }))
  );
  const handleColorSchemeChange = handleSettingChange(setColorSelect, (value) =>
    makeOriginalCharts(data, questions, getOptions({ color: value }))
  );
  const handleXSelectChange = handleSettingChange(setXSelect, (value) =>
    newCustomChart(data, getCustomColumns([value, ySelect]), getOptions())
  );
  const handleYSelectChange = handleSettingChange(setYSelect, (value) =>
    newCustomChart(data, getCustomColumns([xSelect, value]), getOptions())
  );

  function getOptions(custom = {}) {
    return Object.assign(
      {
        size: dotSize,
        opacity: dotOpacity,
        graph: graphType,
        color: colorSelect,
      },
      custom
    );
  }

  function getCustomColumns([x, y]) {
    if (questions == null) return null;
    if (x == "" || y == "") return null;
    return [questions[x], questions[y]];
  }

  return (
    <div class={style.results}>
      <h1>
        <Text id="results.title">Results</Text>
      </h1>
      <p>
        <Text id="results.content">Project presentation...</Text>
      </p>
      <div class="knobs">
        <label for="dotsize">dot size</label>
        <input
          type="range"
          id="dotsize"
          min="1"
          max="50"
          step="0.2"
          name="size"
          value={dotSize}
          oninput={handleDotSizeInput}
        />
        <span id="dotsizevalue">{dotSize}</span>
        <br />
        <label for="dotopacity">dot opacity</label>
        <input
          type="range"
          id="dotopacity"
          min="0"
          max="1"
          step="0.01"
          name="opacity"
          value={dotOpacity}
          oninput={handleDotOpacityInput}
        />
        <span id="dotopacityvalue">{dotOpacity}</span>
        <br />
        <label for="graphselect">graph type: </label>
        <select
          id="graphselect"
          name="graphselect"
          onchange={handleGraphTypeChange}
        >
          <option selected value="scatterplot">
            Scatterplot
          </option>
          <option value="heatmap">Heatmap</option>
        </select>

        <label for="colorselect">color scheme: </label>
        <select
          id="colorselect"
          name="colorselect"
          onchange={handleColorSchemeChange}
          disabled={graphType !== GRAPH_TYPE.heatmap}
        >
          {Object.entries(COLOR).map(([name, value]) => (
            <option value={value}>{name}</option>
          ))}
        </select>

        <br />
        <label for="xselect">horizontal: </label>
        <select id="xselect" onchange={handleXSelectChange}>
          <option value="">choose an option</option>
          {questions != null &&
            questions.map((option, idx) => (
              <option value={`${idx}`}>{option}</option>
            ))}
        </select>
        <label for="yselect">vertical: </label>
        <select id="yselect" onchange={handleYSelectChange}>
          <option value="">choose an option</option>
          {questions != null &&
            questions.map((option, idx) => (
              <option value={`${idx}`}>{option}</option>
            ))}
        </select>
      </div>
      <div class="container" />
    </div>
  );
};

export default Results;
