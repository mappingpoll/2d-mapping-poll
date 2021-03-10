import { h } from "preact";
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from "../../constants";
import { Axes } from "../../components/viz/scatterplot-axes";
import vizStyle from "../../components/viz/style.css";
import formStyle from "./style.css";

export default function EmptyGraph(props) {
  return (
    <div class={vizStyle.vizContainer} style={props.style}>
      <div
        class={formStyle.fuckoffOverlay}
        style={{
          opacity: props.fuckoff / 100,
        }}
      />
      <Axes
        class={vizStyle.viz}
        width={DEFAULT_CANVAS_WIDTH}
        height={DEFAULT_CANVAS_HEIGHT}
      />

      <div class={`${vizStyle.label} ${vizStyle.top}`}>{props.labels.top}</div>
      <div class={`${vizStyle.label} ${vizStyle.left}`}>
        {props.labels.left}
      </div>
      <div class={`${vizStyle.label} ${vizStyle.right}`}>
        {props.labels.right}
      </div>
      <div class={`${vizStyle.label} ${vizStyle.bottom}`}>
        {props.labels.bottom}
      </div>
    </div>
  );
}
