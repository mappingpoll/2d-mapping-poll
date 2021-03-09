import { h } from "preact";
import { Language } from "../../components/app";
import { useContext } from "preact/hooks";
import { MarkupText, Text } from "preact-i18n";
import Graph from "./graph";
import style from "./style.css";

// Note: `user` comes from the URL, courtesy of our router
const Form = props => {
  const lang = useContext(Language);

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
      {/* <h1>
        <Text id="form.title">Form</Text>
      </h1>
      <p>
        <MarkupText id="form.presentation">
          This exercise is a survey of sorts, in which I ask you to mark your
          position on a series of diagrams, in relation to a variety of
          subjective questions. It is part of my research, and I plan to compile
          all of the answers I collect into a publication. Your answers will be
          anonymous.
          <br />
          In each diagram, try to locate where you see yourself on the
          horizontal and the vertical scales. Indicate the spot where these
          values intersect by tracing a dot.
        </MarkupText>
      </p> */}
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
      <form onSubmit={handleSubmit}>
        {/* <h2>
          <Text id="form.part">Part</Text> I
        </h2> */}
        <p>
          <MarkupText id="form.demo.description" />
        </p>
        <div class={style["graph-container"]}>
          <Graph
            id="demograph"
            reportValues={collectValuesFor("demograph")}
            labelTop={
              <Text id="form.demo.top">
                Gender identity is an social construct
              </Text>
            }
            labelBottom={
              <Text id="form.demo.bottom">Gender identity is biological</Text>
            }
            labelLeft={<Text id="form.demo.left">Male</Text>}
            labelRight={<Text id="form.demo.right">Female</Text>}
          />
        </div>

        <button type="submit">
          <Text id="form.submit">Submit</Text>
        </button>
      </form>
    </div>
  );
};

export default Form;
