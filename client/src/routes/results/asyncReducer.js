/* eslint-disable no-fallthrough */
import assign from "lodash.assign";
import { AXES_DOMAIN, DOMAIN, INITIAL_STATE } from "../../constants";
import { parseLocalCSV } from "./fetch/parseLocalCSV";
import {
  filterDataByDataset,
  cleanQuestions,
  getPairwiseColumns,
} from "../../lib/data-manipulation";
import { getColorScale } from "../../lib/viztools";

const CSV_PATH = "../../assets/data/all_maps.csv";

let fullData;

export async function reducer(state, action) {
  switch (action.type) {
    case "RESET":
      state = INITIAL_STATE;
    case "FETCH_DATA": {
      if (fullData == null) {
        const data = await parseLocalCSV(CSV_PATH);
        fullData = data;
      }

      const questions = cleanQuestions(fullData);
      const vizColumns = getPairwiseColumns(questions);
      const colorScale = getColorScale(state.options.color, DOMAIN);
      const standardColumnSet = vizColumns;
      return assign(
        { ...state },
        {
          data: fullData,
          questions,
          vizColumns,
          colorScale,
          standardColumnSet,
        }
      );
    }
    case "FILTER_DATASET": {
      const options = { ...state.options };
      options.dataset = action.payload.dataset;
      const data = filterDataByDataset(fullData, options.dataset);
      return assign({ ...state }, { data, options });
    }
    case "TOGGLE_REV_COLOR": {
      const options = assign(state.options, {
        reverseColor: !state.options.reverseColor,
      });
      const colorScale = getColorScale(
        options.color,
        AXES_DOMAIN,
        options.reverseColor
      );
      return assign({ ...state }, { options, colorScale });
    }
    case "CHANGE_COLOR_SCHEME": {
      const options = assign(state.options, action.payload);
      const colorScale = getColorScale(
        options.color,
        AXES_DOMAIN,
        options.reverseColor
      );
      return assign({ ...state }, { options, colorScale });
    }
    case "CHANGE_GRAPH_TYPE":
    case "CHANGE_DOT_OPACITY":
    case "CHANGE_DOT_SIZE":
    case "CHANGE_CONTOUR_BANDWIDTH": {
      const options = assign(state.options, action.payload);
      return assign({ ...state }, { options });
    }
    case "TOGGLE_CUSTOM": {
      const customViz = !state.customViz;
      return assign({ ...state }, { customViz });
    }
    case "SET_X_AXIS":
    case "SET_Y_AXIS":
    case "SET_Z_AXIS": {
      const userAxes = assign({ ...state.userAxes }, action.payload);
      return assign({ ...state }, { userAxes });
    }
    case "BRUSH": {
      const brushMap = action.payload;
      return assign({ ...state }, { brushMap });
    }

    default:
      throw new ReferenceError(`unknown action: '${action.type}' received`);
  }
}
