import { h } from "preact";
import style from "./style.css";

export default function DoubleSlider() {
  return (
    <div class={style.doubleSlider}>
      <div class={`${style.thumb} ${style.thumbLeft}`} />
      <div class={`${style.thumb} ${style.thumbRight}`} />
    </div>
  );
}
