import { useEffect, useState } from "preact/hooks";
import { reducer } from "./asyncReducer";
// import { useMobileContext } from "../../components/mobile-context";
import { hasXAxis, canShowCustomViz } from "./viz/lib/misc";
import { COLOR_SCHEME, DATASETS, GRAPH_TYPE, INITIAL_STATE } from "./constants";
import { Viz } from "./viz/viz";
import { Text } from "preact-i18n";
import ColorScaleLegend from "./viz/components/colorScaleLegend/colorScaleLegend";
import style from "./style.css";

function useAsyncReducer(reducer, initState) {
  const [state, setState] = useState(initState),
    dispatchState = async action => setState(await reducer(state, action));
  return [state, dispatchState];
}

const Results = () => {
  // STATE
  const [state, dispatch] = useAsyncReducer(reducer, INITIAL_STATE);
  useEffect(() => {
    if (state.data == null) dispatch({ type: "FETCH_DATA" });
  });

  // const isMobile = useMobileContext();

  // ALIASES
  const totalRespondants = state.data?.length;
  const graphType = state.options.graph;

  // CONDITIONALS
  const isScatterplot =
    graphType === GRAPH_TYPE.scatterplot ||
    graphType === GRAPH_TYPE.contourScatterplot ||
    graphType === GRAPH_TYPE.density;
  // const isHeatmap = graphType === GRAPH_TYPE.heatmap;

  const hasColor =
    graphType === GRAPH_TYPE.colorContour || graphType === GRAPH_TYPE.heatmap;

  const hasDots =
    graphType === GRAPH_TYPE.scatterplot ||
    graphType === GRAPH_TYPE.contourScatterplot ||
    graphType === GRAPH_TYPE.density;

  const hasContour =
    graphType === GRAPH_TYPE.contourScatterplot ||
    graphType === GRAPH_TYPE.colorContour ||
    graphType === GRAPH_TYPE.contour;

  const shouldDisableDotSize = !isScatterplot;
  const shouldDisableDotOpacity = shouldDisableDotSize;
  // const shouldDisableColorMid = !wantsColorDimension;
  const shouldDisableColorSchemeSelect = !hasColor;
  const shouldDisableXAxisSelect = !state.customViz;
  const shouldDisableYAxisSelect =
    !state.customViz || !hasXAxis(state.userAxes);
  // const shouldDisableZAxisSelect =
  //   !state.customViz || isHeatmap || !hasXYAxes(state.userAxes);
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
  const handleDotSizeChange = handleSettingChange("CHANGE_DOT_SIZE", "size");
  const handleDotOpacityChange = handleSettingChange(
    "CHANGE_DOT_OPACITY",
    "opacity"
  );
  // const handleColorMidInput = handleSettingChange("CHANGE_COLOR_MID", "k");
  const handleContourBandwidthChange = handleSettingChange(
    "CHANGE_CONTOUR_BANDWIDTH",
    "contourBandwidth"
  );

  const handleWantsCustomGraphClick = handleSettingChange("TOGGLE_CUSTOM");
  const handleReverseColorClick = handleSettingChange("TOGGLE_REV_COLOR");

  const handleXSelectChange = handleSettingChange("SET_X_AXIS", "x");
  const handleYSelectChange = handleSettingChange("SET_Y_AXIS", "y");
  // const handleZSelectChange = handleSettingChange("SET_Z_AXIS", "z");

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
    }
  }

  const customViz = shouldShowCustomViz ? (
    <Viz state={state} callback={handleVizInput} />
  ) : null;

  const visuals = state.standardColumnSet.map(columns => (
    <Viz state={state} columns={columns} callback={handleVizInput} />
  ));

  // JSX
  return (
    <div class={style.results}>
      <div class={style.head}>
        <h1>
          <Text id="results.title">Results</Text>
        </h1>
        <p>
          <Text id="results.content">Project presentation...</Text>
        </p>
      </div>

      <div class={style.knobs}>
        <div id="graphselect" class={style.knobssubsection}>
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
              <Text id="results.knobs.density">density scatterplot</Text>
            </option>
            <option value={GRAPH_TYPE.contourScatterplot}>
              <Text id="results.knobs.contourScatter">contour scatterplot</Text>
            </option>
            <option value={GRAPH_TYPE.contour}>
              <Text id="results.knobs.contour">contour</Text>
            </option>
            <option value={GRAPH_TYPE.colorContour}>
              <Text id="results.knobs.colorContour">colored contour</Text>
            </option>
            <option value={GRAPH_TYPE.heatmap}>
              <Text id="results.knobs.heatmap">heatmap</Text>
            </option>
          </select>
        </div>
        <div
          id="colorKnobs"
          class={style.knobssubsection}
          style={`display: ${hasColor ? "initial" : "none"}`}
        >
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
          <input
            type="checkbox"
            id="revcolorcheckbox"
            value="custom"
            checked={state.options.reverseColor}
            onclick={handleReverseColorClick}
          />
          <label for="revcolorcheckbox">
            <Text id="results.knobs.revColor">reverse?</Text>
          </label>
          <div class={style.colorLegend}>
            <ColorScaleLegend colorScale={state.colorScale} />
          </div>
        </div>

        <div
          id="dotsKnobs"
          class={style.knobssubsection}
          style={`display: ${hasDots ? "initial" : "none"}`}
        >
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
            onchange={handleDotSizeChange}
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
            onchange={handleDotOpacityChange}
            disabled={shouldDisableDotOpacity}
          />
          {/* <span id="dotopacityvalue">{dotOpacity}</span> */}
          <br />
        </div>
        <div
          id="contourknobs"
          class={style.knobssubsection}
          style={`display: ${hasContour ? "initial" : "none"}`}
        >
          <label for="bandwidthrange">
            <Text id="results.knobs.bandwidthrange">Density bandwidth:</Text>
          </label>
          <input
            type="range"
            id="contourBandwitdh"
            min="1"
            max="100"
            step="1"
            name="contourBandwitdh"
            value={state.options.contourBandwidth}
            onchange={handleContourBandwidthChange}
          />
        </div>
        <div id="axesselectors" class={style.knobssubsection}>
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
          <div
            class={style.userAxes}
            style={`display: ${state.customViz ? "inherit" : "none"}`}
          >
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
            {/* <br />
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
            </select> */}
          </div>
        </div>
        <div id="dataselectors" class={style.knobssubsection}>
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
