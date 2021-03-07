import { h } from "preact";
import { useD3 } from "../../../../hooks/useD3";
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from "../../constants";
import { xScale, yScale } from "../lib/scales";
import { appendAxes } from "../lib/scatterplot-axes";
import { isBrushed, isValidDatum, makeBrushTool } from "../lib/viztools";
import { useMobileContext } from "../../../../components/mobile-context";
import style from "../style.css";

export default function Scatterplot({
  data,
  columns,
  options,
  brushMap,
  callback,
}) {
  const isMobile = useMobileContext();
  let [x, y] = columns;

  const brushTool = makeBrushTool(({ selection }) => {
    // get selection area
    if (selection == null) {
      callback({ type: "brush", payload: {} });
      return;
    }
    const extent = selection;
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
      appendAxes(svg);

      // add brushing on desktop
      if (!isMobile) svg.call(brushTool);
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
    </>
  );
}