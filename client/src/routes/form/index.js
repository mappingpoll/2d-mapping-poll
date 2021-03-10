import { h } from "preact";
import { Language } from "../../components/app";
import { useContext, useReducer } from "preact/hooks";
import { MarkupText, Text } from "preact-i18n";
import style from "./style.css";
import FormSection from "./formSection";
import { reducer } from "./reducer";
import { makeI18nLabels } from "./misc";

const defaultValues = {
  points: [],
  confidence: 100,
  fuckoff: 0,
};

const initialState = {
  demoGraph: defaultValues,
};

const Form = props => {
  const lang = useContext(Language);
  const [state, dispatch] = useReducer(reducer, initialState);

  function dispatchSubsection(formSubsectionName) {
    return function (action) {
      const payload = { section: formSubsectionName, values: action.payload };
      dispatch({ type: action.type, payload });
    };
  }

  // collect values from graph interfaces
  const userInput = {};
  function collectValuesFor(id) {
    return function (values = {}) {
      if (!userInput[id]) userInput[id] = {};
      for (let value in values) {
        Object.assign(userInput[id], { [value]: values[value] });
      }
    };
  }

  // submit values to server
  function handleSubmit(e) {
    e.preventDefault();

    const formData = {
      language: lang,
      graphValues: userInput,
    };

    let host, port;
    if (process.env != null) {
      host = process.env.PREACT_APP_LOCALHOST ?? "http://localhost";
      port = process.env.PREACT_APP_PORT ?? "3000";
    }
    fetch(`${host}:${port}/form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(msg => console.log(msg))
      .catch(err => console.error(err.message));
  }

  return (
    <div class={style.form}>
      <label for="lang-select">
        <Text id="form.lang-select">Language</Text>:
      </label>
      <select
        name="lang"
        value={lang}
        id="lang-select"
        onChange={e => props.swapLang(e.target.value)}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
      <div class={style.help}>
        <MarkupText id="graph.instructions">
          <ol>
            <li>
              Indicate your position by placing a dot at the X and Y coordinates
              that best represent your position.
            </li>
            <li>
              If a single point does not suffice, you may add one or more
              additional points to nuance your stance by clicking/touching a
              blank area.
            </li>
            <li>
              Use the sliders below the graph to qualify your answer further.
            </li>
          </ol>
        </MarkupText>
      </div>

      <FormSection
        id="demoGraph"
        dispatch={dispatchSubsection("demoGraph")}
        values={state.demoGraph}
        description=""
        labels={makeI18nLabels("form.demo", {
          top: "Gender identity is 100% a social construct",
          bottom: "Gender identity is 100% biological",
          left: "Male",
          right: "Female",
        })}
      />

      {/* <button type="submit" onClick={handleSubmit}>
        <Text id="form.submit">Submit</Text>
      </button> */}
    </div>
  );
};

export default Form;
