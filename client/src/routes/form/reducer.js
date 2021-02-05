// reducer to coordinate point positions, sizes, etc

export const reducer = (points, action) => {
  const { type, payload } = action;
  const newPoints = [...points];
  switch (type) {
    case "PLACE_NEW_POINT":
      // expected payload: [x, y]
      return [...points, payload];
    case "MOVE_POINT":
      // expected payload: { id, position: [x, y] }
      newPoints[payload.id] = payload.position;
      return newPoints;
    case "REMOVE_POINT":
      return newPoints.slice(0, -1);
    case "REMOVE_ALL_POINTS":
      return [];
    case "OFFSET_POINTS":
      // expected payload: [ xOffset, yOffset]
      return newPoints.map(([x, y]) => [x + payload[0], y + payload[1]])
    default:
      throw new Error("Unexpected action");
  }
};
export const action = (type, payload = {}) => ({ type, payload });
