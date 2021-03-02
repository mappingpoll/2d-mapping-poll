import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Text } from "preact-i18n";
import style from "./style.css";
import { reducer } from "./asyncReducer";
import DoubleSlider from "./viz/components/double-range-slider/DoubleSlider";
import {
  COLOR_SCHEME,
  DATASETS,
  DOMAIN,
  GRAPH_TYPE,
  INITIAL_STATE,
} from "./constants";
import { Viz } from "./viz/viz";
import {
  hasThreeAxes,
  hasXAxis,
  hasXYAxes,
  canShowCustomViz,
} from "./viz/lib/misc";
import { getCustomColumns } from "./viz/lib/data-manipulation";
import { getColorScale } from "./viz/lib/viztools";

function useAsyncReducer(reducer, initState) {
  const [state, setState] = useState(initState),
    dispatchState = async action => setState(await reducer(state, action));
  return [state, dispatchState];
}

const Results = () => {
  const [state, dispatch] = useAsyncReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (state.data == null) dispatch({ type: "FETCH_DATA" });
  });

  const totalRespondants = state.data?.length;

  // CONDITIONALS
  const isScatterplot = state.options.graph === GRAPH_TYPE.scatterplot;
  const isHeatmap = state.options.graph === GRAPH_TYPE.heatmap;
  const isColorChart =
    state.options.graph !== GRAPH_TYPE.contour &&
    state.options.graph !== GRAPH_TYPE.contourScatterplot;

  const wantsColorDimension =
    hasThreeAxes(state.userAxes) || isHeatmap || isColorChart;
  const shouldDisableDotSize = !isScatterplot;
  const shouldDisableDotOpacity = shouldDisableDotSize;
  const shouldDisableColorMid = !wantsColorDimension;
  const shouldDisableColorSchemeSelect = !wantsColorDimension;
  const shouldDisableXAxisSelect = !state.customViz;
  const shouldDisableYAxisSelect =
    !state.customViz || !hasXAxis(state.userAxes);
  const shouldDisableZAxisSelect =
    !state.customViz || isHeatmap || !hasXYAxes(state.userAxes);
  const shouldShowCustomViz =
    state.customViz && canShowCustomViz(state.userAxes);

  // EVENT HANDLERS
  const handleSettingChange = (type, prop, callback = null) => event => {
    dispatch({ type, payload: { [prop]: event.target.value } });
    if (callback != null && typeof callback === "function") callback();
  };

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
  const handleColorMidInput = handleSettingChange("CHANGE_COLOR_MID", "k");

  const handleWantsCustomGraphClick = handleSettingChange("TOGGLE_CUSTOM");

  const handleXSelectChange = handleSettingChange("SET_X_AXIS", "x");
  const handleYSelectChange = handleSettingChange("SET_Y_AXIS", "y");
  const handleZSelectChange = handleSettingChange("SET_Z_AXIS", "z");

  const handleDatasetChange = event => {
    const clicked = event.target.value;
    let other,
      dataset = { ...state.options.dataset };
    if (DATASETS.form.includes(clicked))
      other = clicked === "aga" ? "ba" : "aga";
    else if (DATASETS.language.includes(clicked))
      other = clicked === "en" ? "fr" : "en";

    dataset[clicked] = !dataset[clicked];
    if (!dataset[clicked] && !dataset[other]) {
      dataset[other] = true;
    }
    dispatch({ type: "FILTER_DATASET", payload: { dataset } });
  };

  function handleVizInput(input) {
    switch (input.type) {
      case "brush":
        dispatch({ type: "BRUSH", payload: input.payload });
        break;
      case "zrange":
        dispatch({ type: "Z_RANGE", payload: input.payload });
        break;
    }
  }

  const customViz = shouldShowCustomViz ? (
    <Viz
      data={state.data}
      columns={getCustomColumns(state.questions, state.userAxes)}
      options={state.options}
      brushMap={state.brushMap}
      callback={handleVizInput}
    />
  ) : null;

  const visuals = state.standardColumnSet.map(columns => (
    <Viz
      data={state.data}
      columns={columns}
      options={state.options}
      brushMap={state.brushMap}
      callback={handleVizInput}
    />
  ));

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
        <div>
          <label for="graphselect">
            <Text id="results.knobs.graphtype">Graph type:</Text>
          </label>
          <select
            id="graphselect"
            name="graphselect"
            onchange={handleGraphTypeChange}
          >
            <option selected value={GRAPH_TYPE.scatterplot}>
              <Text id="results.knobs.scatterplot">scatterplot</Text>
            </option>
            <option value={GRAPH_TYPE.density}>
              <Text id="resuts.knobs.density">density scatterplot</Text>
            </option>
            <option value={GRAPH_TYPE.contour}>
              <Text id="results.knobs.contour">contour</Text>
            </option>
            <option value={GRAPH_TYPE.colorContour}>
              <Text id="results.knobs.colorContour">colored contour</Text>
            </option>
            <option value={GRAPH_TYPE.contourScatterplot}>
              <Text id="resuts.knobs.contourScatter">contour scatterplot</Text>
            </option>
            <option value={GRAPH_TYPE.heatmap}>
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
            disabled={shouldDisableColorSchemeSelect}
          >
            {Object.entries(COLOR_SCHEME).map(([name, value]) => (
              <option value={value}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label for="dotsize">
            <Text id="results.knobs.dotsize">Dot size:</Text>
          </label>
          <input
            type="range"
            id="dotsize"
            min="1"
            max="90"
            step="0.1"
            name="size"
            value={state.options.size}
            oninput={handleDotSizeInput}
            disabled={shouldDisableDotSize}
          />
          {/* <span id="dotsizevalue">{dotSize}</span> */}
          <br />
          <label for="dotopacity">
            <Text id="results.knobs.dotopacity">Dot opacity:</Text>
          </label>
          <input
            type="range"
            id="dotopacity"
            min="0.01"
            max="1"
            step="0.01"
            name="opacity"
            value={state.options.opacity}
            oninput={handleDotOpacityInput}
            disabled={shouldDisableDotOpacity}
          />
          {/* <span id="dotopacityvalue">{dotOpacity}</span> */}
          <br />
          <label for="colormid">
            <Text id="results.knobs.colormid">Color curve:</Text>
          </label>
          <input
            type="range"
            id="colormid"
            min="0.05"
            max="1"
            step="0.01"
            name="colormid"
            value={state.options.k}
            oninput={handleColorMidInput}
            disabled={shouldDisableColorMid}
          />
        </div>
        <div class={style.knobssubsection}>
          <div>
            <input
              type="checkbox"
              id="customgraphcheckbox"
              value="custom"
              checked={state.customViz}
              onclick={handleWantsCustomGraphClick}
            />
            <label for="customgraphcheckbox">
              <Text id="results.knobs.custom">Custom axes:</Text>
            </label>
          </div>
          <label for="xselect">
            <Text id="results.knobs.horizontal">Horizontal axis:</Text>
          </label>
          <select
            id="xselect"
            onchange={handleXSelectChange}
            disabled={shouldDisableXAxisSelect}
          >
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
          <select
            id="yselect"
            onchange={handleYSelectChange}
            disabled={shouldDisableYAxisSelect}
          >
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
            disabled={shouldDisableZAxisSelect}
          >
            <option value="">
              <Text id="results.knobs.option">choose an option</Text>
            </option>
            {state.questions != null &&
              state.questions.map((option, idx) => (
                <option value={`${idx}`}>{option}</option>
              ))}
          </select>
        </div>
        <div class={style.knobssubsection}>
          <p>
            <Text id="results.knobs.showdata">
              Show answers collected from:
            </Text>{" "}
          </p>
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
              <Text id="results.knobs.engforms">English questionnaires</Text>
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
              <Text id="results.knobs.frforms">French questionnaires</Text>
            </label>
          </div>
        </div>
        <div>
          <p>
            <span>{totalRespondants}</span>{" "}
            <Text id="results.knobs.respondants">respondants</Text>
          </p>
        </div>
      </div>
      <div class={style.visualsContainer}>
        {shouldShowCustomViz && (
          <div class={style.customViz}>Custom graph:{customViz}</div>
        )}
        <div class={style.standardViz}>{visuals}</div>
      </div>
    </div>
  );
};

export default Results;
