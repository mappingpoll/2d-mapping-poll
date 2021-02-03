import { h } from "preact";
import { Language } from "../../components/app";
import { useContext, useEffect, useState } from "preact/hooks";
import { Text } from "preact-i18n";
import Graph from "./graph";
import style from "./style.css";

// Note: `user` comes from the URL, courtesy of our router
const Form = (props) => {
  const lang = useContext(Language);

  // collect values from graph interfaces
  const graphValues = {};
  function collectValues(id, values = {}) {
		if (!graphValues[id]) graphValues[id] = {};
    for (let value in values) {
			Object.assign(graphValues[id], {[value]: values[value]});
		}
  }

	// submit values to server
  function handleSubmit(e) {
    e.preventDefault();

    const formData = {
      language: lang,
      graphValues,
    };

    let host, port;
    if (process.env != null) {
      host = process.env.PREACT_APP_LOCALHOST ?? "";
      port = process.env.PREACT_APP_PORT ?? "3000";
    }
    fetch(`${host}:${port}/form`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
			.then((msg) => console.log(msg))
      .catch((err) => console.error(err.message));
  }

  return (
    <div class={style.form}>
      <h1>
        <Text id="form.title">Form</Text>
      </h1>
      <p>
        <Text id="form.presentation">Form presentation...</Text>
      </p>
      <form onSubmit={handleSubmit}>
        <label for="lang-select">
          <Text id="form.lang-select">Language</Text>:
        </label>
        <select
          name="lang"
          value={lang}
          id="lang-select"
          onChange={(e) => props.swapLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
        <h2>
          <Text id="form.part">Part</Text> I
        </h2>
        <p>
          <Text id="form.part1.description">
            Description of the first part...
          </Text>
        </p>
        <Graph
					id="1.1"
          returnValues={collectValues.bind(null, "1.1")}
          labelTop={<Text id="form.part1.q1.top">I'm happy</Text>}
          labelBottom={<Text id="form.part1.q1.bottom">I'm unhappy</Text>}
          labelLeft={<Text id="form.part1.q1.left">I'm young</Text>}
          labelRight={<Text id="form.part1.q1.right">I'm old</Text>}
        />
        <button type="submit">
          <Text id="form.submit">Submit</Text>
        </button>
      </form>
    </div>
  );
};

export default Form;
