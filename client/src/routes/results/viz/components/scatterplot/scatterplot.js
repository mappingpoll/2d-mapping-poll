import { h } from "preact";
import { useD3 } from "../../../../../hooks/useD3";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  DOMAIN,
  DEFAULT_DOT_COLOR,
} from "../../../constants";
import { xScale, yScale, arrowheadPaths } from "../../lib/scales";
import { xAxis, yAxis, zAxis } from "../scatterplot/scatterplot-axes";
import { getColorScale, isValidDatum } from "../../lib/viztools";

import { questions } from "../../../../../i18n/fr.json";
import { Text } from "preact-i18n";
import style from "./style.css";
import DoubleSlider from "../double-range-slider/DoubleSlider";

function dotId(_, i) {
  return `dot-${i}`;
}

export default function Scatterplot({ data, columns, options }) {
  const hasColorDimension = columns.length === 3;
  let colorScale;
  if (hasColorDimension) {
    colorScale = getColorScale(options.color, DOMAIN, options.k);
  }
  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();
      // append dots
      svg
        .append("g")
        .attr("stroke-width", options.size)
        .attr("stroke-opacity", options.opacity)
        .attr("stroke-linecap", "round")
        .selectAll("path")
        // filter out NAs
        .data(data.filter(d => isValidDatum(d, columns)))
        .join("path")
        .attr("class", "dot graphcontent")
        .attr("id", dotId)
        .attr("d", d => `M${xScale(d[columns[0]])}, ${yScale(d[columns[1]])}h0`)
        // color, if any
        .attr(
          "stroke",
          hasColorDimension ? d => colorScale(d[columns[2]]) : DEFAULT_DOT_COLOR
        );

      // draw axes, columns
      svg.append("g").call(arrowheadPaths);
      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);
      //if (hasColorDimension) svg.append("g").call(zAxis(colorScale));
    },
    [data, columns, options.size, options.opacity, options.k]
  );

  return (
    <>
      <svg
        class={style.viz}
        ref={ref}
        viewBox={`0, 0, ${DEFAULT_CANVAS_WIDTH}, ${DEFAULT_CANVAS_HEIGHT}`}
        width={DEFAULT_CANVAS_WIDTH}
        height={DEFAULT_CANVAS_HEIGHT}
      />
      <div class={`${style.label} ${style.right}`}>
        <Text id={`questions.${columns[0]}.fr.end`}>
          {questions[columns[0]].en.end}
        </Text>
      </div>
      <div class={`${style.label} ${style.left}`}>
        <Text id={`questions.${columns[0]}.fr.start`}>
          {questions[columns[0]].en.start}
        </Text>
      </div>
      <div class={`${style.label} ${style.bottom}`}>
        <Text id={`questions.${columns[1]}.fr.start`}>
          {questions[columns[1]].en.start}
        </Text>
      </div>
      <div class={`${style.label} ${style.top}`}>
        <Text id={`questions.${columns[1]}.fr.end`}>
          {questions[columns[1]].en.end}
        </Text>
      </div>
      {hasColorDimension && (
        <>
          <div class={`${style.label} ${style.zleft}`}>
            <Text id={`questions.${columns[2]}.fr.start`}>
              {questions[columns[2]].en.start}
            </Text>
          </div>
          <div class={style.zslider}>
            <DoubleSlider
              smoothness={100}
              options={options}
              oninput={console.log}
            />
          </div>
          <div class={`${style.label} ${style.zright}`}>
            <Text id={`questions.${columns[2]}.fr.end`}>
              {questions[columns[2]].en.end}
            </Text>
          </div>
        </>
      )}
    </>
  );
}
