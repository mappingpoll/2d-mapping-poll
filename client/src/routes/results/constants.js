export const NA_SYMBOL = "NA";

export const GRAPH_TYPE = {
  scatterplot: "scatterplot",
  heatmap: "heatmap",
  density: "density scatterplot",
  contour: "contour",
  colorContour: "color contour",
  contourScatterplot: "contour scatterplot",
};
export const COLOR_SCHEME = {
  greyscale: "interpolateGreys",
  viridis: "interpolateViridis",
  plasma: "interpolatePlasma",
  warm: "interpolateWarm",
  cividis: "interpolateCividis",
  coolwarm: "coolwarm",
};
export const CUSTOM_COLORS = {
  coolwarm: ["CornflowerBlue", "DimGray", "IndianRed"],
};
export const DEFAULT_DOT_COLOR = "black";
export const DEFAULT_COLOR_SCHEME = COLOR_SCHEME.greyscale;
export const DEFAULT_GRAPH_TYPE = GRAPH_TYPE.scatterplot;
export const DEFAULT_DOT_SIZE = 50;
export const DEFAULT_DOT_OPACITY = 0.05;
export const HIGHLIGHT_OPACITY = 1;
export const HIGHTLIGHT_COLOR = "red";
export const DEFAULT_COLOR_MID = 1;
export const DEFAULT_CANVAS_WIDTH = 1000;
export const DEFAULT_CANVAS_HEIGHT = 800;
export const DEFAULT_CANVAS_MARGIN = {
  top: 25,
  right: 25,
  bottom: 25,
  left: 25,
};

// should be same as --track-width, --track-height, etc in src/style/index.css
export const TRACK_WIDTH = 400;
export const TRACK_HEIGHT = 5;
export const THUMB_HEIGHT = 20;
export const THUMB_WIDTH = 20;

export const DATASETS = {
  language: ["en", "fr"],
  form: ["aga", "ba"],
};
export const MARGIN = DEFAULT_CANVAS_MARGIN;
export const UNCERTAINTY = 0.5;
export const DOMAIN = [-15, 15];
export const AXES_DOMAIN = [-10, 10];
export const DOMAIN_DISCREET = (() => {
  const arr = [];
  for (let i = DOMAIN[0]; i <= DOMAIN[1]; i++) {
    arr.push(i);
  }
  return arr;
})();
export const ORIGIN = {
  x: MARGIN.left + (DEFAULT_CANVAS_WIDTH - MARGIN.left - MARGIN.right) / 2,
  y: MARGIN.top + (DEFAULT_CANVAS_HEIGHT - MARGIN.top - MARGIN.bottom) / 2,
};
const ARROW_LENGTH = 18;
const ARROW_FEATHER_SIZE = 5;
// arrowheads
const CARDINAL_MATRICES = [
  [
    [
      [1, 0],
      [0, 1],
    ],
    [
      [-1, 0],
      [0, 1],
    ],
  ],
  [
    [
      [0, -1],
      [1, 0],
    ],
    [
      [0, -1],
      [-1, 0],
    ],
  ],
  [
    [
      [-1, 0],
      [0, -1],
    ],
    [
      [1, 0],
      [0, -1],
    ],
  ],
  [
    [
      [0, 1],
      [-1, 0],
    ],
    [
      [0, 1],
      [1, 0],
    ],
  ],
];

export const ARROW_PATHS = tips =>
  tips.map((arrow, i) => {
    let v1, v2;
    const translate = n => (p, j) =>
      p +
      CARDINAL_MATRICES[i][n][j][0] * ARROW_FEATHER_SIZE +
      CARDINAL_MATRICES[i][n][j][1] * ARROW_LENGTH;
    v1 = arrow.map(translate(0));
    v2 = arrow.map(translate(1));
    return [...arrow, ...v1, ...v2];
  });

export const INITIAL_STATE = {
  data: null,
  filteredDataset: null,
  questions: null,
  vizColumns: [],
  standardColumnSet: [],
  userAxes: {
    x: "",
    y: "",
    z: "",
  },
  customViz: true,
  brushMap: {},
  zRange: DOMAIN,
  options: {
    size: DEFAULT_DOT_SIZE,
    opacity: DEFAULT_DOT_OPACITY,
    graph: DEFAULT_GRAPH_TYPE,
    color: DEFAULT_COLOR_SCHEME,
    k: DEFAULT_COLOR_MID,
    dataset: {
      aga: true,
      ba: true,
      en: true,
      fr: true,
    },
  },
};
