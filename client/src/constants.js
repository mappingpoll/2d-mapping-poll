import * as d3 from "d3";

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
  nicolas: "nicolas",
};

export const CUSTOM_COLORS = {
  coolwarm: d3.interpolateRgbBasis(["CornflowerBlue", "DimGray", "IndianRed"]),
  nicolas: d3.interpolateRgbBasis([
    "#de0000",
    "#b9001e",
    "#a5013c",
    "#920e64",
    "#782793",
    "#694dc6",
    "#4e6ee3",
    "#1e83ff",
    "#03a2ff",
  ]),
};
export const DEFAULT_DOT_COLOR = "black";
export const DEFAULT_COLOR_SCHEME = COLOR_SCHEME.greyscale;
export const DEFAULT_GRAPH_TYPE = GRAPH_TYPE.scatterplot;
export const DEFAULT_DOT_SIZE = 18;
export const DEFAULT_DOT_OPACITY = 0.13;
export const HIGHLIGHT_OPACITY = 1;
export const HIGHTLIGHT_COLOR = "red";
export const DEFAULT_COLOR_MID = 1;
export const DEFAULT_CANVAS_WIDTH = 1000;
export const DEFAULT_CANVAS_HEIGHT = 1000;
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
function rangeDiscreet(range) {
  const min = Math.min(...range),
    max = Math.max(...range);
  return new Array(max - min + 1).fill(0).map((_, i) => i + min);
}
export const DOMAIN_DISCREET = rangeDiscreet(DOMAIN);
export const AXES_DOMAIN_DISCREET = rangeDiscreet(AXES_DOMAIN);
export const ORIGIN = {
  x: MARGIN.left + (DEFAULT_CANVAS_WIDTH - MARGIN.left - MARGIN.right) / 2,
  y: MARGIN.top + (DEFAULT_CANVAS_HEIGHT - MARGIN.top - MARGIN.bottom) / 2,
};

export const INITIAL_STATE = {
  data: null,
  filteredDataset: null,
  questions: null,
  vizColumns: [],
  standardColumnSet: [],
  customViz: false,
  userAxes: {
    x: "",
    y: "",
    // z: "",
  },
  brushMap: {},
  colorScale: () => {}, //getColorScale(DEFAULT_COLOR_SCHEME, AXES_DOMAIN),
  options: {
    reverseColor: false,
    size: DEFAULT_DOT_SIZE,
    opacity: DEFAULT_DOT_OPACITY,
    contourBandwidth: 25,
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
