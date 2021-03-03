import * as d3 from "d3";
import { CUSTOM_COLORS, DOMAIN, NA_SYMBOL } from "../../constants";
import { symFloor } from "./misc";
import svgExport from "./svg-export";

export function isValidDatum(datum, columns) {
  if (columns instanceof Array !== true) columns = [columns];
  return columns.every(c => datum[c] !== NA_SYMBOL);
}

export function getColorScale(color, domain, rev = false) {
  if (rev) domain = [domain[1], domain[0]];
  console.log(domain[0]);
  let colorScale;
  if (CUSTOM_COLORS[color] == null)
    colorScale = d3.scaleSequential(d3[color]).domain(domain);
  else colorScale = d3.scaleSequential(CUSTOM_COLORS[color]).domain(domain);
  return colorScale;
}

export function calcHeatmap(data, columns) {
  const heatmap = [];
  const totals = {};

  const toPairStr = (x, y) => `${x},${y}`;

  // calc totals in data
  for (let datum of data) {
    if (!isValidDatum(datum, columns)) continue;
    const xValue = symFloor(datum[columns[0]]);
    const yValue = symFloor(datum[columns[1]]);
    const pair = toPairStr(xValue, yValue);
    if (totals[pair] == null) totals[pair] = 0;
    else totals[pair] += 1;
  }
  // format totals into array
  for (let pair in totals) {
    const [x, y] = pair.split(",").map(t => +t);
    heatmap.push({ x, y, value: totals[pair] });
  }
  // iterate over domain to include dataless coords as 0 values
  for (let y = DOMAIN[0]; y <= DOMAIN[1]; y++) {
    for (let x = DOMAIN[0]; x <= DOMAIN[1]; x++) {
      const pair = toPairStr(x, y);
      if (totals[pair] == null) heatmap.push({ x, y, value: 0 });
    }
  }
  return heatmap;
}

export function saveSVG(id) {
  svgExport.downloadSvg(document.querySelector(`#${id}`).firstChild, "viz");

  // const svgEl = d3.select(`#${id}`).select("svg").node();
  // svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  // const svgData = svgEl.outerHTML;
  // const preface = '<?xml version="1.0" standalone="no"?>\r\n';
  // const svgBlob = new Blob([preface, svgData], {
  //   type: "image/svg+xml;charset=utf-8",
  // });
  // const svgUrl = URL.createObjectURL(svgBlob);
  // const downloadLink = document.createElement("a");
  // downloadLink.href = svgUrl;
  // downloadLink.download = "";
  // document.body.appendChild(downloadLink);
  // downloadLink.click();
  // document.body.removeChild(downloadLink);

  // const svgEl = document.querySelector(`#${id}`).firstChild;
  // svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  // const svgData = svgEl.outerHTML;
  // const preface = '<?xml version="1.0" standalone="no"?>\r\n';
  // const svgBlob = new Blob([preface, svgData], {
  //   type: "image/svg+xml;charset=utf-8",
  // });
  // const svgUrl = URL.createObjectURL(svgBlob);
  // const downloadLink = document.createElement("a");
  // downloadLink.href = svgUrl;
  // downloadLink.download = "";
  // document.body.appendChild(downloadLink);
  // downloadLink.click();
  // document.body.removeChild(downloadLink);

  // const svg = document.querySelector(`#${id}`).firstChild;
  // const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  // const svgUrl = URL.createObjectURL(svgBlob);
  // const downloadLink = document.createElement("a");
  // downloadLink.href = svgUrl;
  // downloadLink.download = "viz.svg";
  // document.body.appendChild(downloadLink);
  // downloadLink.click();
  // document.body.removeChild(downloadLink);

  // //get svg source.
  // const serializer = new XMLSerializer();
  // let source = serializer.serializeToString(svg);
  // //add name spaces.
  // if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
  //   source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  // }
  // if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
  //   source = source.replace(
  //     /^<svg/,
  //     '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
  //   );
  // }

  // //add xml declaration
  // source = `<?xml version="1.0" standalone="no"?>\r\n${source}`;

  // //convert svg source to URI data scheme.
  // const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;

  // //set url value to a element's href attribute.
  // const a = document.createElement("a");
  // a.href = url;
  // a.target = "_blank";
  // a.download = "";

  // a.click();
}
