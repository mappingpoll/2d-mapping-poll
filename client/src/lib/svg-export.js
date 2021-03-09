/* eslint-disable react-hooks/rules-of-hooks */
/*
 * svg-export.js - Javascript SVG parser and renderer on Canvas
 * version 1.0.0
 * MIT Licensed
 * Sharon Choong (https://sharonchoong.github.io/about.html)
 * https://sharonchoong.github.io/svg-export
 *
 */

const svgExport = {};
let version = "1.0.0";
let _options = {};

function getSvgElement(svg) {
  let div = document.createElement("div");
  div.className = "tempdiv-svg-exportJS";

  if (typeof svg === "string") {
    div.insertAdjacentHTML("beforeend", svg.trim());
    svg = div.firstChild;
  }

  if (!svg.nodeType || svg.nodeType !== 1) {
    //console.log("Error svg-export: The input svg was not recognized");
    return null;
  }

  let svgClone = svg.cloneNode(true);
  svgClone.style.display = null;
  div.appendChild(svgClone);
  div.style.visibility = "hidden";
  div.style.display = "table";
  div.style.position = "absolute";
  document.body.appendChild(div);

  return svgClone;
}

function setOptions(svgElement, options) {
  //initialize options
  _options = {
    originalWidth: 100,
    originalHeight: 100,
    width: 100,
    height: 100,
    scale: 1,
    useCSS: true,
    transparentBackgroundReplace: "white",
    pdfOptions: {
      customFonts: [],
      pageLayout: { margin: 50, margins: {} },
      addTitleToPage: true,
      chartCaption: "",
      pdfTextFontFamily: "Helvetica",
      pdfTitleFontSize: 20,
      pdfCaptionFontSize: 14,
    },
  };

  //original size
  _options.originalHeight =
    svgElement.style.getPropertyValue("height").indexOf("%") !== -1 ||
    (svgElement.getAttribute("height") &&
      svgElement.getAttribute("height").indexOf("%") !== -1)
      ? svgElement.getBBox().height * _options.scale
      : svgElement.getBoundingClientRect().height * _options.scale;
  _options.originalWidth =
    svgElement.style.getPropertyValue("width").indexOf("%") !== -1 ||
    (svgElement.getAttribute("width") &&
      svgElement.getAttribute("width").indexOf("%") !== -1)
      ? svgElement.getBBox().width * _options.scale
      : svgElement.getBoundingClientRect().width * _options.scale;

  //custom options
  if (options && options.scale && typeof options.scale === "number") {
    _options.scale = options.scale;
  }
  if (!options || !options.height) {
    _options.height = _options.originalHeight * _options.scale;
  } else if (typeof options.height === "number") {
    _options.height = options.height * _options.scale;
  }
  if (!options || !options.width) {
    _options.width = _options.originalWidth * _options.scale;
  } else if (typeof options.width === "number") {
    _options.width = options.width * _options.scale;
  }
  if (options && options.useCSS === false) {
    _options.useCSS = false;
  }
  if (options && options.transparentBackgroundReplace) {
    _options.transparentBackgroundReplace =
      options.transparentBackgroundReplace;
  }
}

function useCSSfromComputedStyles(element, elementClone) {
  if (typeof getComputedStyle !== "function") {
    //console.log("Warning svg-export: this browser is not able to get computed styles");
    return;
  }
  element.childNodes.forEach((child, index) => {
    if (child.nodeType === 1 /*Node.ELEMENT_NODE*/) {
      useCSSfromComputedStyles(
        child,
        elementClone.childNodes[parseInt(index, 10)]
      );
    }
  });

  let compStyles = window.getComputedStyle(element);
  if (compStyles.length > 0) {
    for (const compStyle of compStyles) {
      if (
        ["width", "height", "inline-size", "block-size"].indexOf(compStyle) ===
        -1
      ) {
        elementClone.style.setProperty(
          compStyle,
          compStyles.getPropertyValue(compStyle)
        );
      }
    }
  }
}

function setupSvg(svgElement, originalSvg, asString) {
  if (typeof asString === "undefined") {
    asString = true;
  }
  if (_options.useCSS && typeof originalSvg === "object") {
    useCSSfromComputedStyles(originalSvg, svgElement);
    svgElement.style.display = null;
  }

  svgElement.style.width = null;
  svgElement.style.height = null;
  svgElement.setAttribute("width", _options.width);
  svgElement.setAttribute("height", _options.height);
  svgElement.setAttribute("preserveAspectRatio", "none");
  svgElement.setAttribute(
    "viewBox",
    `0 0 ${_options.originalWidth} ${_options.originalHeight}`
  );

  let elements = document.getElementsByClassName("tempdiv-svg-exportJS");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }

  //get svg string
  if (asString) {
    let serializer = new XMLSerializer();
    //setting currentColor to black matters if computed styles are not used
    let svgString = serializer
      .serializeToString(svgElement)
      .replace(/currentColor/g, "black");

    //add namespaces
    if (
      !svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)
    ) {
      svgString = svgString.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg"'
      );
    }
    if (!svgString.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      svgString = svgString.replace(
        /^<svg/,
        '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
      );
    }

    return svgString;
  }
  return svgElement;
}

function triggerDownload(uri, name, canvas) {
  name = name.replace(/[/\\?%*:|"<>]/g, "_");
  if (navigator.msSaveBlob) {
    let binary = decodeURIComponent(uri.split(",")[1]),
      array = [];
    let mimeString = uri.split(",")[0].split(":")[1].split(";")[0];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    let blob = null;
    if (canvas != null) {
      blob = canvas.msToBlob();
    } else {
      blob = new Blob([new Uint8Array(array)], { type: mimeString });
    }
    return navigator.msSaveBlob(blob, name);
  }
  let link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadSvg(svg, svgName, options) {
  let svgElement = getSvgElement(svg);
  if (!svgElement) {
    return;
  }
  if (svgName == null) {
    svgName = "chart";
  }

  //get svg element
  setOptions(svgElement, options);
  let svgString = setupSvg(svgElement, svg);

  //add xml declaration
  svgString = `<?xml version="1.0" standalone="no"?>\r\n${svgString}`;

  //convert svg string to URI data scheme.
  let url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

  triggerDownload(url, `${svgName}.svg`);
}

svgExport.version = version;
svgExport.downloadSvg = downloadSvg;

export default svgExport;
