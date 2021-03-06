import { h } from "preact";
import * as d3 from "d3";
import { useD3 } from "../../../../../hooks/useD3";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
} from "../../../constants";
import { questions } from "../../../../../i18n/fr.json";
import { Text } from "preact-i18n";
import style from "./style.css";
import { computeDensity, getColorScale } from "../../lib/viztools";
import { arrowheads, xAxis, yAxis } from "../../lib/scatterplot-axes";

export default function ColorContour({ data, columns: columns2d, options }) {
  let [x, y] = columns2d;

  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();

      // draw axes, columns
      svg.append("g").call(arrowheads);
      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

      // compute the density data
      const densityData = computeDensity(
        data,
        options.contourBandwidth,
        columns2d
      );

      // Prepare a color palette
      const color = getColorScale(
        options.color,
        [
          Math.min(...densityData.map(d => d.value)),
          Math.max(...densityData.map(d => d.value)),
        ],
        options.reverseColor
      );

      // Add the contour: several "path"
      svg
        .insert("g", "g")
        .selectAll("path")
        .data(densityData)
        .enter()
        .append("path")
        .attr("class", style.coutourPath)
        .attr("d", d3.geoPath())
        .attr("stroke", (_, i) => (i === 0 ? color(1) : "none"))
        .attr("fill", d => color(d.value));
    },
    [
      data,
      columns2d,
      options.color,
      options.contourBandwidth,
      options.reverseColor,
    ]
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
    </>
  );
}
