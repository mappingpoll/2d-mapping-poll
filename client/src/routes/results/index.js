import { h } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import style from "./style.css";
import { Text } from "preact-i18n";
import { reducer } from "./reducer";

import {
  CSV_PATH,
  DEFAULT_DOT_SIZE,
  DEFAULT_DOT_OPACITY,
  COLOR,
  DEFAULT_GRAPH_TYPE,
  DEFAULT_COLOR,
  GRAPH_TYPE,
  DEFAULT_COLOR_MID,
  DATASETS,
} from "./constants";

import { parseLocalCSV } from "./fetch/parseLocalCSV";
import { assign } from "lodash";

const initialState = {
  data: null,
  questions: null,
  charts: [],
  axes: {
    x: "",
    y: "",
    z: "",
  },
  options: {
    size: DEFAULT_DOT_SIZE,
    opacity: DEFAULT_DOT_OPACITY,
    graph: DEFAULT_GRAPH_TYPE,
    color: DEFAULT_COLOR,
    k: DEFAULT_COLOR_MID,
    dataset: {
      aga: true,
      ba: true,
      en: true,
      fr: true
    }
  },
};

function init(initialState) {
  return initialState;
}

const Results = () => {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  useEffect(() => {
    if (state.data == null)
      parseLocalCSV(CSV_PATH).then((data) => {
        dispatch({ type: "SET_DATA", payload: data });
      });
  });

  const totalRespondants = () => state.data?.length;

  // CONDITIONALS
  const hasXYAxes = ({ x, y }) => x != "" && y != "";

  const hasThreeAxes = ({ x, y, z }) => x != "" && y != "" && z != "";

  const hasColorDimension = () =>
    hasThreeAxes(state.axes) || state.options.graph === GRAPH_TYPE.heatmap;

  // EVENT HANDLERS
  const handleSettingChange = (type, prop) => (event) =>
    dispatch({ type, payload: { [prop]: event.target.value } });

  const handleGraphTypeChange = handleSettingChange(
    "CHANGE_GRAPH_TYPE",
    "graph"
  );
  const handleColorSchemeChange = handleSettingChange(
    "CHANGE_COLOR_SCHEME",
    "color"
  );
  const handleDotSizeInput = handleSettingChange("CHANGE_DOT_SIZE", "size");
  const handleDotOpacityInput = handleSettingChange(
    "CHANGE_DOT_OPACITY",
    "opacity"
  );
  const handleColorMidinput = handleSettingChange("CHANGE_COLOR_MID", "k");
  const handleXSelectChange = handleSettingChange("SET_X_AXIS", "x");
  const handleYSelectChange = handleSettingChange("SET_Y_AXIS", "y");
  const handleZSelectChange = handleSettingChange("SET_Z_AXIS", "z");
  const handleDatasetChange = event => {
    const clicked = event.target.value;
    let other, dataset = {...state.options.dataset};
    if (DATASETS.form.includes(clicked))
      other = clicked === 'aga' ? 'ba' : 'aga';
    else if (DATASETS.language.includes(clicked))
      other = clicked === 'en' ? 'fr' : 'en';

    dataset[clicked] = !dataset[clicked]
    if (!dataset[clicked] && !dataset[other]) {
      dataset[other] = true;
    }
    dispatchDatasetFilter(dataset)
  }

  function dispatchDatasetFilter(dataset) {
    parseLocalCSV(CSV_PATH).then(data => dispatch({type: "FILTER_DATASET", payload: {data, dataset}}))
  }
  

  // JSX
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
          disabled={!hasColorDimension()}
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
          value={state.options.size}
          oninput={handleDotSizeInput}
          disabled={state.options.graph !== GRAPH_TYPE.scatterplot}
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
          value={state.options.opacity}
          oninput={handleDotOpacityInput}
          disabled={state.options.graph !== GRAPH_TYPE.scatterplot}
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
          value={state.options.k}
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
          {state.questions != null &&
            state.questions.map((option, idx) => (
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
          {state.questions != null &&
            state.questions.map((option, idx) => (
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
            !hasXYAxes(state.axes) || state.options.graph === GRAPH_TYPE.heatmap
          }
        >
          <option value="">
            <Text id="results.knobs.option">choose an option</Text>
          </option>
          {state.questions != null &&
            state.questions.map((option, idx) => (
              <option value={`${idx}`}>{option}</option>
            ))}
        </select>
        <fieldset class={style.datarestrict}>
          <legend>
            <Text id="results.knobs.showdata">
              Show answers collected from:
            </Text>{" "}
          </legend>
          <div>
            <input
              type="checkbox"
              id="aga"
              name="aga"
              value="aga"
              checked={state.options.dataset.aga}
              onclick={handleDatasetChange}
            />
            <label for="aga">
              <Text id="results.knobs.aga">
                Sobey Art Award Exhibition, Art Gallery of Alberta, Edmonton,
                October 5, 2019 - January 5, 2020
              </Text>
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="ba"
              name="ba"
              value="ba"
              checked={state.options.dataset.ba}
              onclick={handleDatasetChange}
            />
            <label for="ba">
              <Text id="results.knobs.ba">
                Exhibition "Positions", Galerie Bradley Ertaskiran, Montreal,
                January 24 - March 7, 2020
              </Text>
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="enforms"
              name="en"
              value="en"
              checked={state.options.dataset.en}
              onclick={handleDatasetChange}
            />
            <label for="enforms">
              <Text id="results.knobs.engforms">
                English questionnaires
              </Text>
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="frforms"
              name="fr"
              value="fr"
              checked={state.options.dataset.fr}
              onclick={handleDatasetChange}
            />
            <label for="frforms">
              <Text id="results.knobs.frforms">
                French questionnaires
              </Text>
            </label>
          </div>
        </fieldset>
          <div>
            <p><span>{totalRespondants()}</span> <Text id="results.knobs.respondants">respondants</Text></p>
          </div>
      </div>
      <div class="container">{state.charts}</div>
    </div>
  );
};

export default Results;
