import { assign } from "lodash";
import { GRAPH_TYPE } from "./constants";
import getQuestions from "./viz/filterQuestions";
import { newGraphs, newChartsCollection, updateDotAppearance } from "./viz/viz";

// CONDITIONALS
const hasXYAxes = ({ x, y }) => x !== "" && y !== "";

const hasThreeAxes = ({ x, y, z }) => x != "" && y != "" && z != "";

const shouldShowCustomChart = (axes) => hasXYAxes(axes);

const getColumns = (questions, axes) =>
  shouldShowCustomChart(axes)
    ? Object.values(axes)
        .filter((a) => a !== "")
        .map((a) => questions[a])
    : questions;

const isScatterplot = (graph) => graph === GRAPH_TYPE.scatterplot;
const isHeatmap = (graph) => graph === GRAPH_TYPE.heatmap;

function filterData(data, dataset) {
  return data.filter((d) => {
    for (let condition in dataset) {
      if (d.Language === condition && !dataset[condition]) return false;
      if (d.poll.toLowerCase() === condition && !dataset[condition])
        return false;
    }
    return true;
  });
}

export function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA": {
      const data = action.payload;
      const questions = getQuestions(data);
      const charts = newChartsCollection(data, questions, state.options);
      return assign(
        { ...state },
        {
          data: action.payload,
          questions,
          charts,
        }
      );
    }
    case "FILTER_DATASET": {
      const options = { ...state.options };
      options.dataset = action.payload.dataset;
      const data = filterData(action.payload.data, options.dataset);
      const charts = newGraphs(
        data,
        getColumns(state.questions, state.axes),
        options
      );
      return assign({ ...state }, { data, options, charts });
    }
    case "DRAW_CUSTOM_VIZ": {
      const charts = newGraphs(
        state.data,
        getColumns(state.questions, state.axes),
        state.options
      );
      return assign({ ...state }, { charts });
    }
    case "DRAW_VIZ_COLLECTION": {
      const charts = newGraphs(state.data, state.questions, state.options);
      return assign({ ...state }, { charts });
    }
    case "CHANGE_COLOR_SCHEME":
    case "CHANGE_GRAPH_TYPE": {
      const options = assign(state.options, action.payload);
      const columns = getColumns(state.questions, state.axes);
      const charts = newGraphs(state.data, columns, options);
      return assign({ ...state }, { charts, options });
    }
    case "CHANGE_COLOR_MID":
      {
        const options = assign(state.options, action.payload);
        if (isScatterplot(state.options.graph) && hasThreeAxes(state.axes)) {
          updateDotAppearance(action.payload, {
            data: state.data,
            columns: getColumns(state.questions, state.axes),
            options: state.options,
          });
          return assign({ ...state }, { options });
        } else if (isHeatmap(state.options.graph)) {
          const charts = newGraphs(
            state.data,
            getColumns(state.questions, state.axes),
            options
          );
          return assign({ ...state }, { charts, options });
        }
      }
      break;
    case "CHANGE_DOT_OPACITY":
    case "CHANGE_DOT_SIZE": {
      const options = assign(state.options, action.payload);
      updateDotAppearance(action.payload);
      return assign({ ...state }, { options });
    }
    case "SET_X_AXIS":
    case "SET_Y_AXIS":
    case "SET_Z_AXIS": {
      const axes = assign(state.axes, action.payload);
      if (shouldShowCustomChart(axes)) {
        const columns = getColumns(state.questions, axes);
        const charts = newGraphs(state.data, columns, state.options);
        return assign({ ...state }, { charts, axes });
      }
      return assign({ ...state }, { axes });
    }
    default:
      throw new ReferenceError(`unknown action: '${action.type}' received`);
  }
}
