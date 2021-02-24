import { h } from "preact"
import * as d3 from "d3";
import { Text } from "preact-i18n";
import {
  UNCERTAINTY,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
} from "../../../constants";
import { xScale, yScale, xBand, yBand } from "../../lib/scales";
import { calcHeatmap, getColorScale } from "../../lib/viztools";
import { questions } from "../../../../../i18n/fr.json";
import style from "./style.css";
import { useD3 } from "../../../../../hooks/useD3";

export default function Heatmap({data, columns, options}) {
    // calc heatmap values (totals answers per grid zone (UNCERTAINTY*2 by UNCERTAINTY*2))
    const heatmap = calcHeatmap(data, columns);
    let min = Infinity,
      max = -Infinity;
    for (let { value } of heatmap) {
      let n = value;
      min = n < min ? n : min;
      max = n > max ? n : max;
    }
  const colorScale = getColorScale(options.color, [min, max], options.k);
  const ref = useD3(svg => {

    svg
      .append("g")
      .selectAll("rect")
      .data(heatmap)
      .join("rect")
      .attr("class", "rect graphcontent")
      .attr("y", d => yScale(d.y + UNCERTAINTY))
      .attr("x", d => xScale(d.x - UNCERTAINTY))
      .attr("width", xBand.bandwidth())
      .attr("height", yBand.bandwidth())
      // .attr("stroke", d => colorScale(d.value))
      .attr("fill", d => colorScale(d.value));
  }, [columns, options.color, options.k]);

  return (
    <div class={style["viz-container"]}>
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
    </div>
  );
}
