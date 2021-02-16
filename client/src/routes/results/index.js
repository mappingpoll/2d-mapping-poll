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
  DEFAULT_COLOR_MID,
} from "./constants";

import {
  makeChartsCollection,
  updateDotSizes,
  newCustomChart,
  updateDotOpacity,
  updateColors,
} from "./viz";

const Results = () => {
  // const lang = useContext(Language)

  let [dotSize, setDotSize] = useState(DEFAULT_DOT_SIZE);
  let [dotOpacity, setDotOpacity] = useState(DEFAULT_DOT_OPACITY);
  let [colorMid, setColorMid] = useState(DEFAULT_COLOR_MID);
  let [data, setData] = useState(null);
  let [questions, setQuestions] = useState(null);
  let [graphType, setGraphType] = useState(DEFAULT_GRAPH_TYPE);
  let [xSelect, setXSelect] = useState("");
  let [ySelect, setYSelect] = useState("");
  let [zSelect, setZSelect] = useState("");
  let [zColorSelect, setZColorSelect] = useState(DEFAULT_COLOR);
  let [colorSelect, setColorSelect] = useState(DEFAULT_COLOR);
  let [charts, setCharts] = useState([]);

  //setCharts = (...args) => args === null ? null : setCharts(args)

  function getOptions(customOptions = {}) {
    return Object.assign(
      {
        size: dotSize,
        opacity: dotOpacity,
        graph: graphType,
        color: getColorSelection(),
        k: colorMid,
      },
      customOptions
    );
  }

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
        setCharts(makeChartsCollection(data, qs, getOptions()));
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


  // CONDITIONALS
  const hasXYAxes = (a = xSelect, b = ySelect) => a != "" && b != "";

  const hasThreeAxes = () => xSelect != "" && ySelect != "" && zSelect != "";

  const hasColorDimension = () =>
    graphType === GRAPH_TYPE.heatmap || hasThreeAxes();

  const shouldShowCustomChart = () => hasXYAxes() || hasThreeAxes();

  const getColorSelection = () =>
    hasThreeAxes() && graphType === GRAPH_TYPE.scatterplot
      ? zColorSelect
      : colorSelect;



  // EVENT HANDLERS

  const handleGraphTypeChange = handleSettingChange(
    setGraphType,
    (graphValue) => {
      const options = getOptions({ graph: graphValue });
      if (shouldShowCustomChart()) {
        setCharts(newCustomChart(data, getCustomColumns(), options));
      } else {
        setCharts(makeChartsCollection(data, questions, options));
      }
    }
  );

  
  const handleColorSchemeChange = handleSettingChange(
    setColorSelect,
    (color) => {
      if (shouldShowCustomChart()) {
        const chart = updateColors(
          data,
          getCustomColumns(),
          getOptions({ color })
        );
        if (chart != null) setCharts(chart);
      } else {
        setCharts(makeChartsCollection(data, questions, getOptions({ color })));
      }
    }
  );


  const handleDotSizeInput = handleSettingChange(setDotSize, (dotSizeValue) =>
    updateDotSizes(dotSizeValue)
  );

  const handleDotOpacityInput = handleSettingChange(
    setDotOpacity,
    (dotOpacityValue) => updateDotOpacity(dotOpacityValue)
  );

  const handleColorMidinput = handleSettingChange(
    setColorMid,
    (colorMidValue) => {
      if (shouldShowCustomChart()) {
        const chart = updateColors(
          data,
          getCustomColumns(),
          getOptions({
            k: colorMidValue,
          })
        );
        if (chart != null) setCharts(chart);
      } else {
        setCharts(
          makeChartsCollection(
            data,
            questions,
            getOptions({ k: colorMidValue })
          )
        );
      }
    }
  );


  const handleXSelectChange = handleSettingChange(setXSelect, (xValue) => {
    if (hasXYAxes(xValue, ySelect))
      setCharts([
        newCustomChart(data, getCustomColumns([xValue, ySelect]), getOptions()),
      ]);
  });
  const handleYSelectChange = handleSettingChange(setYSelect, (yValue) => {
    if (hasXYAxes(xSelect, yValue))
      setCharts([
        newCustomChart(data, getCustomColumns([xSelect, yValue]), getOptions()),
      ]);
  });
  const handleZSelectChange = handleSettingChange(setZSelect, (zValue) => {
    if (hasXYAxes(xSelect, ySelect) && zValue != "")
      setCharts([
        newCustomChart(
          data,
          getCustomColumns([xSelect, ySelect, zValue]),
          getOptions()
        ),
      ]);
  });

  const handleZColorChange = handleSettingChange(setZColorSelect, (color) => {
    const chart = updateColors(data, getCustomColumns(), getOptions({ color }));
    if (chart != null) setCharts(chart);
  });

  function getCustomColumns([x, y, z] = [xSelect, ySelect, zSelect]) {
    if (questions == null) return null;
    if (x == "" || y == "") return null;
    return [questions[x]].concat(
      z != null ? [questions[y], questions[z]] : questions[y]
    );
  }

  return (
    <div class={style.results}>
      <h1>
        <Text id="results.title">Results</Text>
      </h1>
      <p>
        <Text id="results.content">Project presentation...</Text>
      </p>
      <div class={style.knobs}>
        <label for="graphselect">
          <Text id="results.knobs.graphtype">Graph type:</Text>
        </label>
        <select
          id="graphselect"
          name="graphselect"
          onchange={handleGraphTypeChange}
        >
          <option selected value="scatterplot">
            <Text id="results.knobs.scatterplot">scatterplot</Text>
          </option>
          <option value="heatmap">
            <Text id="results.knobs.heatmap">heatmap</Text>
          </option>
        </select>
        <label for="colorselect">
          <Text id="results.knobs.color">Color scheme:</Text>
        </label>
        <select
          id="colorselect"
          name="colorselect"
          onchange={handleColorSchemeChange}
          disabled={graphType === GRAPH_TYPE.scatterplot}
        >
          {Object.entries(COLOR).map(([name, value]) => (
            <option value={value}>{name}</option>
          ))}
        </select>

        <br />
        <label for="dotsize">
          <Text id="results.knobs.dotsize">Dot size:</Text>
        </label>
        <input
          type="range"
          id="dotsize"
          min="1"
          max="50"
          step="0.2"
          name="size"
          value={dotSize}
          oninput={handleDotSizeInput}
          disabled={graphType !== GRAPH_TYPE.scatterplot}
        />
        {/* <span id="dotsizevalue">{dotSize}</span> */}
        <br />
        <label for="dotopacity">
          <Text id="results.knobs.dotopacity">Dot opacity:</Text>
        </label>
        <input
          type="range"
          id="dotopacity"
          min="0"
          max="1"
          step="0.01"
          name="opacity"
          value={dotOpacity}
          oninput={handleDotOpacityInput}
          disabled={graphType !== GRAPH_TYPE.scatterplot}
        />
        {/* <span id="dotopacityvalue">{dotOpacity}</span> */}
        <br />
        <label for="colormid">
          <Text id="results.knobs.colormid">Color curve:</Text>
        </label>
        <input
          type="range"
          id="colormid"
          min="0"
          max="1"
          step="0.01"
          name="colormid"
          value={colorMid}
          oninput={handleColorMidinput}
          disabled={!hasColorDimension()}
        />
        <br />

        <label for="xselect">
          <Text id="results.knobs.horizontal">Horizontal axis:</Text>
        </label>
        <select id="xselect" onchange={handleXSelectChange}>
          <option value="">
            <Text id="results.knobs.option">choose an option</Text>
          </option>
          {questions != null &&
            questions.map((option, idx) => (
              <option value={`${idx}`}>{option}</option>
            ))}
        </select>
        <br />
        <label for="yselect">
          <Text id="results.knobs.vertical">Vertical axis:</Text>
        </label>
        <select id="yselect" onchange={handleYSelectChange}>
          <option value="">
            <Text id="results.knobs.option">choose an option</Text>
          </option>
          {questions != null &&
            questions.map((option, idx) => (
              <option value={`${idx}`}>{option}</option>
            ))}
        </select>
        <br />
        <label for="zselect">
          <Text id="results.knobs.z">3rd dimension:</Text>
        </label>
        <select
          id="zselect"
          onchange={handleZSelectChange}
          disabled={
            !shouldShowCustomChart() || graphType === GRAPH_TYPE.heatmap
          }
        >
          <option value="">
            <Text id="results.knobs.option">choose an option</Text>
          </option>
          {questions != null &&
            questions.map((option, idx) => (
              <option value={`${idx}`}>{option}</option>
            ))}
        </select>

        <label for="colorselect">
          <Text id="results.knobs.color">Color scheme:</Text>
        </label>
        <select
          id="colorselect"
          name="colorselect"
          onchange={handleZColorChange}
          disabled={graphType === GRAPH_TYPE.heatmap || !hasThreeAxes()}
        >
          {Object.entries(COLOR).map(([name, value]) => (
            <option value={value}>{name}</option>
          ))}
        </select>
      </div>
      <div class="container">{charts}</div>
    </div>
  );
};

export default Results;
