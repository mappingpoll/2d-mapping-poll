import { Text } from "preact-i18n";
import style from "./style.css";

export default function FormSectionKnobs(props) {
  const confidence = props.values.confidence ?? 100,
    fuckoff = props.values.fuckoff ?? 0;

  function handleKnobInput(knobName) {
    return function (event) {
      props.dispatch({
        type: "CHANGE_KNOB_VALUE",
        payload: { [knobName]: event.target.value },
      });
    };
  }

  return (
    <div class={style.knobs}>
      <div class={style.slider}>
        <label for="confidence">
          <Text id="graph.confidenceslider.before">
            My position is very uncertain
          </Text>
        </label>
        <input
          type="range"
          id="confidence"
          name="confidence"
          min="1"
          max="100"
          value={confidence.toString()}
          oninput={handleKnobInput("confidence")}
        />
        <label for="confidence">
          <Text id="graph.confidenceslider.after">
            My position is clear and precise
          </Text>
        </label>
      </div>
      <div class={style.slider}>
        <label for="fuckoff">
          <Text id="graph.fuckoffslider.before">Neutral</Text>
        </label>
        <input
          type="range"
          id="fuckoff"
          name="fuckoff"
          min="0"
          max="100"
          value={fuckoff.toString()}
          oninput={handleKnobInput("fuckoff")}
        />
        <label for="confidence">
          <Text id="graph.fuckoffSlider.after">Fuck this question</Text>
        </label>
      </div>
      <button
        type="button"
        onClick={() => props.dispatch({ type: "REMOVE_ALL_POINTS" })}
      >
        <Text id="graph.removeallpoint">Reset</Text>
      </button>
    </div>
  );
}
