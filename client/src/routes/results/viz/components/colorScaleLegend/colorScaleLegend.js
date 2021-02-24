import { h } from "preact";
// import * as d3 from "d3";
import { DOMAIN, DOMAIN_DISCREET, ZLEGEND_HEIGHT } from "../../../constants";
import { zScale } from "../../lib/scales";
import {useD3} from "../../../../../hooks/useD3";

import { getColorScale } from "../../lib/viztools";
import style from "./style.css";


/* function colorRects(props) {
  d3.rect
    .attr("x", d => zScale(d))
    .attr("width", zScale.bandwidth())
    .attr("height", ZLEGEND_HEIGHT)
    .attr("stroke", d => colorScale(d))
    .attr("fill", d => colorScale(d));
  return 
} */

export default function ColorScaleLegend(props) {
  const colorScale = getColorScale(props.options.color, DOMAIN, props.options.k);
  const ref = useD3(
    svg => {
      svg.select(".rectangles")
      .selectAll("rect")
      .data(DOMAIN_DISCREET)
      .join("rect")
      .attr("x", d => zScale(d))
      .attr("width", zScale.bandwidth())
      .attr("height", ZLEGEND_HEIGHT)
      .attr("stroke", d => colorScale(d))
      .attr("fill", d => colorScale(d));
    }, [props.options.color, props.options.k]
  )

  return (
    <svg
      ref={ref}
      class={style.colorScale}
      width={props.width}
      height={props.height}
    >
      <g class={style.rectangles} className="rectangles" />
    </svg>
  );
}
