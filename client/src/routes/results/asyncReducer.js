import assign from "lodash.assign";
import { AXES_DOMAIN } from "./constants";
import { parseLocalCSV } from "./fetch/parseLocalCSV";
import {
  filterDataByDataset,
  cleanQuestions,
  getPairwiseColumns,
} from "./viz/lib/data-manipulation";
import { getColorScale } from "./viz/lib/viztools";

/* function refreshVizColumns(state) {
  if (state.custom && canShowCustomViz(state.userAxes))
    return getCustomColumns(state.questions, state.userAxes);
  return getPairwiseColumns(state.questions);
} */

const CSV_PATH = "../../assets/data/all_maps.csv";

let fullData;

export async function reducer(state, action) {
  switch (action.type) {
    case "FETCH_DATA": {
      const data = await parseLocalCSV(CSV_PATH);
      fullData = data;
      const questions = cleanQuestions(data);
      const vizColumns = getPairwiseColumns(questions);
      const standardColumnSet = vizColumns;
      return assign(
        { ...state },
        {
          data,
          questions,
          vizColumns,
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
    case "CHANGE_DOT_SIZE": {
      const options = assign(state.options, action.payload);
      return assign({ ...state }, { options });
    }
    case "TOGGLE_CUSTOM": {
      const customViz = !state.customViz; /* 
      if (canShowCustom(state.userAxes)) {
        const vizColumns = custom
          ? getCustomColumns(state.questions, state.userAxes)
          : getPairwiseColumns(state.questions);
        return assign({ ...state }, { custom, vizColumns });
      } */
      return assign({ ...state }, { customViz });
    }
    case "SET_X_AXIS":
    case "SET_Y_AXIS":
    case "SET_Z_AXIS": {
      const userAxes = assign({ ...state.userAxes }, action.payload);
      // if (canShowCustomViz(userAxes)) {
      //   const vizColumns = getCustomColumns(state.questions, userAxes);
      //   return assign({ ...state }, { vizColumns, userAxes });
      // }
      return assign({ ...state }, { userAxes });
    }
    case "BRUSH": {
      const brushMap = action.payload;
      return assign({ ...state }, { brushMap });
    }

    case "Z_RANGE": {
      const { zRange } = action.payload;
      return assign({ ...state }, { zRange });
    }
    default:
      throw new ReferenceError(`unknown action: '${action.type}' received`);
  }
}
