import { h } from "preact";
import { useD3 } from "../../../../../hooks/useD3";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
} from "../../../constants";
import { xScale, yScale, arrowheadPaths } from "../../lib/scales";
import { xAxis, yAxis } from "../../lib/scatterplot-axes";
import { isBrushed, isValidDatum, makeBrushTool } from "../../lib/viztools";

import { questions } from "../../../../../i18n/fr.json";
import { Text } from "preact-i18n";
import style from "./style.css";

export default function Scatterplot({
  data,
  columns,
  options,
  brushMap,
  callback,
}) {
  let [x, y] = columns;

  const brushTool = makeBrushTool(brushEvent => {
    // get selection area
    const extent = brushEvent.selection;
    const brushed = data.reduce(
      (map, d, i) =>
        isValidDatum(d, columns) &&
        isBrushed(extent, xScale(d[x]), yScale(d[y]))
          ? { ...map, [i]: true }
          : map,
      {}
    );
    callback({ type: "brush", payload: brushed });
  });

  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();
      // append dots
      svg
        .append("g")
        .selectAll("path")
        // filter out NAs
        .data(
          data
            .map((d, i) => (brushMap[i] ? { ...d, brushed: true } : d))
            .filter(d => isValidDatum(d, columns))
        )
        .join("path")
        .attr("stroke-width", options.size)
        .attr("stroke-opacity", options.opacity)
        .attr("class", d =>
          d.brushed ? `${style.dot} ${style.brushed}` : style.dot
        )
        .attr("d", d => `M${xScale(d[x])}, ${yScale(d[y])}h0`);

      // draw axes, columns
      svg.append("g").call(arrowheadPaths);
      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

      // add brushing
      svg.call(brushTool);
    },
    [data, columns, brushMap, options.size, options.opacity]
  );

  return (
    <>
      <svg
        id="dataviz_scatterplot"
        class={style.viz}
        ref={ref}
        viewBox={`0, 0, ${DEFAULT_CANVAS_WIDTH}, ${DEFAULT_CANVAS_HEIGHT}`}
        width={DEFAULT_CANVAS_WIDTH}
        height={DEFAULT_CANVAS_HEIGHT}
      />
      <div class={`${style.label} ${style.right}`}>
        <Text id={`questions.${x}.fr.end`}>{questions[x].en.end}</Text>
      </div>
      <div class={`${style.label} ${style.left}`}>
        <Text id={`questions.${x}.fr.start`}>{questions[x].en.start}</Text>
      </div>
      <div class={`${style.label} ${style.bottom}`}>
        <Text id={`questions.${y}.fr.start`}>{questions[y].en.start}</Text>
      </div>
      <div class={`${style.label} ${style.top}`}>
        <Text id={`questions.${y}.fr.end`}>{questions[y].en.end}</Text>
      </div>
      {/* isCustomChart && (
        <>
          <div class={`${style.label} ${style.zleft}`}>
            <Text id={`questions.${z}.fr.start`}>{questions[z].en.start}</Text>
          </div>
          <div class={style.zslider}>
            <DoubleSlider
              init={zRange}
              min={DOMAIN[0]}
              max={DOMAIN[1]}
              step={0.5}
              smoothness={100}
              options={options}
              oninput={handleZRangeInput}
              colorScale={colorScale}
            />
          </div>
          <div class={`${style.label} ${style.zright}`}>
            <Text id={`questions.${z}.fr.end`}>{questions[z].en.end}</Text>
          </div>
        </>
      ) */}
    </>
  );
}
