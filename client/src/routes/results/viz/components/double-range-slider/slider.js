import { h } from "preact";
import ColorScaleLegend from "../colorScaleLegend/colorScaleLegend";
import style from "./style.css"

export default function DoubleSlider(props) {
  return (
    <div class={style.doubleSlider}>
      <div class={style.track}>
        <ColorScaleLegend width={props.width} height={props.height} options={props.options} />
      </div>
      <div class={`${style.thumb} ${style.thumbLeft}`} />        
      <div class={`${style.thumb} ${style.thumbRight}`} />
    </div>
  )
}