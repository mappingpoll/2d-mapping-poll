export const CSV_PATH = "../../assets/data/all_maps.csv";

/* :root {
	--svg-defaultdotsize: 23;
	--svg-defaultdotopacity: 0.2;
	--svg-canvaswidth: 1000;
	--svg-canvasheight: 800;
	--svg-canvasmargintop: 40;
	--svg-canvasmarginright: 40;
	--svg-canvasmarginbottom: 40;
	--svg-canvasmarginleft: 40;
  } */

export const GRAPH_TYPE = {
  scatterplot: "scatterplot",
  heatmap: "heatmap",
};
export const COLOR = {
  greyscale: "interpolateGreys",
  viridis: "interpolateViridis",
  plasma: "interpolatePlasma",
  warm: "interpolateWarm",
};
export const DEFAULT_COLOR = COLOR.greyscale;
export const DEFAULT_GRAPH_TYPE = GRAPH_TYPE.scatterplot;
export const DEFAULT_DOT_SIZE = 23;
export const DEFAULT_DOT_OPACITY = 0.2;
export const DEFAULT_CANVAS_WIDTH = 1000;
export const DEFAULT_CANVAS_HEIGHT = 800;
export const DEFAULT_CANVAS_MARGIN = {
  top: 25,
  right: 25,
  bottom: 25,
  left: 25,
};
let cssVar;
if (typeof window !== "undefined") {
  const htmlStyles = window.getComputedStyle(document.querySelector("html"));
  cssVar = (name) => htmlStyles.getPropertyValue(name);
} else {
  cssVar = () => null;
}
export const MARGIN = DEFAULT_CANVAS_MARGIN; /* {
    top: +cssVar("--svg-canvasmargintop"),
    right: +cssVar("--svg-canvasmarginright"),
    bottom: +cssVar("--svg-canvasmarginbottom"),
    left: +cssVar("--svg-canvasmarginleft"),
  }; */
export const WIDTH = +cssVar("--svg-canvaswidth");
export const HEIGHT = +cssVar("--svg-canvasheight");
export const DOT_DIAMETER = +cssVar("--svg-defaultdotsize");
export const DOT_OPACITY = +cssVar("--svg-defaultdotopacity");
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
  x: MARGIN.left + (WIDTH - MARGIN.left - MARGIN.right) / 2,
  y: MARGIN.top + (HEIGHT - MARGIN.top - MARGIN.bottom) / 2,
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

export const ARROW_PATHS = (tips) =>
  tips.map((arrow, i) => {
    let v1, v2;
    const translate = (n) => (p, j) =>
      p +
      CARDINAL_MATRICES[i][n][j][0] * ARROW_FEATHER_SIZE +
      CARDINAL_MATRICES[i][n][j][1] * ARROW_LENGTH;
    v1 = arrow.map(translate(0));
    v2 = arrow.map(translate(1));
    return [...arrow, ...v1, ...v2];
  });

export const jitter = (k = UNCERTAINTY) => Math.random() * k * 2 - k;
