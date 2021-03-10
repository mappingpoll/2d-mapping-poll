import hull from "../../lib/hull";
import { assign } from "lodash";
import {
  CONCAVITY,
  INIT_GRAPH_VALUES,
  MAX_N_POINTS,
  USE_HULL,
} from "./constants";
// reducer to coordinate point positions, sizes, etc

const trimHull = vertices => hull(vertices, CONCAVITY).slice(0, -1);

export const reducer = (state, action) => {
  const { type, payload } = action;
  // console.log("received payload", payload);
  const section = payload.section;
  const values = payload.values;
  switch (type) {
    case "CHANGE_KNOB_VALUE": {
      const update = assign({ ...state[section] }, values);

      return assign({ ...state }, { [section]: update });
    }
    case "PLACE_NEW_POINT": {
      if (state[section].points.length === MAX_N_POINTS) return state;
      const points = state[section].points;
      const point = values;
      let newPoints = [...points, point];
      if (USE_HULL && points.length > 2)
        newPoints = trimHull(newPoints, CONCAVITY);

      const update = { ...state[section] };
      update.points = newPoints;
      return assign({ ...state }, { [section]: update });
    }
    case "SET_POINTS": {
      const points = [...state[section].points];
      const newPoints = USE_HULL ? trimHull(points, CONCAVITY) : points;

      const update = { ...state[section] };
      update.points = newPoints;
      return assign({ ...state }, { [section]: update });
    }
    case "MOVE_POINT": {
      // expected values: { id, position: [x, y] }
      const update = { ...state[section] };
      update.points[values.id] = values.position;
      return assign({ ...state }, { [section]: update });
    }
    // case "REMOVE_POINT":
    //   return newPoints.slice(0, -1);
    case "RESET": {
      return assign({ ...state }, { [section]: INIT_GRAPH_VALUES });
    }
    // case "OFFSET_POINTS":
    //   // expected payload: [ xOffset, yOffset]
    //   return newPoints.map(([x, y]) => [x + payload[0], y + payload[1]]);
    // default:
    //   throw new Error("Unexpected action");
  }
};
export const action = (type, payload = {}) => ({ type, payload });
