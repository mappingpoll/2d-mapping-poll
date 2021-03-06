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
      <h1>
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
      </p>
      <form onSubmit={handleSubmit}>
        <h2>
          <Text id="form.part">Part</Text> I
        </h2>
        <p>
          <MarkupText id="form.part1.description">
            Think of the land where you grew up. Think of its natural physical
            properties, such as mountains, valleys, plains, forests, wetlands,
            rivers, lakes, sea, desert, etc. Then try to imagine this land in
            relation to the totality of physical spaces all across the globe.
            <br />
            In your life, how much did you get to know the physical world?
          </MarkupText>
        </p>
        <Graph
          id="1.1"
          reportValues={collectValuesFor("1.1")}
          labelTop={
            <Text id="form.part1.q1.top">
              I accept the legitimacy of the current world order, with its
              borders, states, nations, etc.
            </Text>
          }
          labelBottom={
            <Text id="form.part1.q1.bottom">
              I don’t believe in the legitimacy of the current world order
            </Text>
          }
          labelLeft={
            <Text id="form.part1.q1.left">
              I care only about the concrete and tangible reality of life
            </Text>
          }
          labelRight={
            <Text id="form.part1.q1.right">
              I care only about the larger questions and abstractions
            </Text>
          }
        />
        <button type="submit">
          <Text id="form.submit">Submit</Text>
        </button>
      </form>
    </div>
  );
};

export default Form;
