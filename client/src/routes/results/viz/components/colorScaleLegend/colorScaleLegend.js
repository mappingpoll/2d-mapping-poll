import { h } from "preact";
import { THUMB_WIDTH, THUMB_HEIGHT, TRACK_WIDTH } from "../../../constants";
import { useD3 } from "../../../../../hooks/useD3";
import style from "./style.css";

export default function ColorScaleLegend(props) {
  const ref = useD3(
    svg => {
      svg.select("g").remove();
      svg
        .append("g")
        .selectAll("path")
        .data(props.domain)
        .join("path")
        .attr(
          "d",
          d =>
            `m${props.xScale(d)}, ${
              THUMB_HEIGHT / 2
            } h${props.xScale.bandwidth()}`
        )
        .attr("stroke", d => props.colorScale(d))
        .attr("stroke-linecap", (_, i) =>
          i % (props.domain.length - 1) === 0 ? "round" : "square"
        );

      /* svg
        .select("path")
        .attr("d", d3.line()(props.domain.map(d => [xScale(d), 0]))); */
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
    >
      {/* <path transform={`translate(0, ${THUMB_HEIGHT / 2})`} /> */}
    </svg>
  );
}
