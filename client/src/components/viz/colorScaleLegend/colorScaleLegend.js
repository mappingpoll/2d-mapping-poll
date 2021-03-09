import { h } from "preact";
import * as d3 from "d3";
import { AXES_DOMAIN_DISCREET, AXES_DOMAIN } from "../../../constants";
import { useD3 } from "../../../hooks/useD3";
import style from "./style.css";

export default function ColorScaleLegend(props) {
  if (props.steps == null) props.steps = AXES_DOMAIN_DISCREET;
  const height = 15;
  const range = [0, 400];

  const xScale = d3.scaleLinear().domain(AXES_DOMAIN).range(range);

  const dStr = d3
    .line()
    .x(d => xScale(d))
    .y(0);

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
      class={style.colorScale}
      viewBox={`0, 0, ${range[1]}, ${height}`}
      width={range[1]}
      height={height}
    />
  );
}
