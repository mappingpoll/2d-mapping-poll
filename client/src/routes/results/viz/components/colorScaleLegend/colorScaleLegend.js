import { h } from "preact";
import * as d3 from "d3";
import {
  THUMB_WIDTH,
  THUMB_HEIGHT,
  TRACK_WIDTH,
  DOMAIN,
} from "../../../constants";
import { useD3 } from "../../../../../hooks/useD3";
import style from "./style.css";

export default function ColorScaleLegend(props) {
  const range = [THUMB_WIDTH / 2, TRACK_WIDTH + THUMB_WIDTH / 2];

  const xScale = d3.scaleLinear().domain(DOMAIN).range(range);

  const dStr = d3
    .line()
    .x(d => xScale(d))
    .y(THUMB_HEIGHT / 2);

  const ref = useD3(
    svg => {
      svg.selectAll("path").remove();
      svg
        .selectAll("path")
        .data(
          props.steps.map((s, i) =>
            i === props.steps.length - 1 ? [s] : [s, props.steps[i + 1]]
          )
        )
        .enter()
        .append("path")
        .attr("d", d => dStr(d))
        .attr("stroke", d => props.colorScale(d[0]));
    },
    [props.colorScale]
  );

  return (
    <svg
      ref={ref}
      viewBox={`0, 0, ${TRACK_WIDTH + THUMB_WIDTH}, ${THUMB_HEIGHT}`}
      width={TRACK_WIDTH + THUMB_WIDTH}
      height={THUMB_HEIGHT}
      class={style.colorScale}
    />
  );
}
