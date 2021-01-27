import { h } from "preact";
import { Router } from "preact-router";

import { IntlProvider } from "preact-i18n";
import frDefinition from "../i18n/fr.json";

import Header from "./header";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Form from "../routes/form";
import Results from "../routes/results"
import { useState } from "preact/hooks";

let defaultDefinition;

function getDefinition(lang) {
  if (/^fr\b/.test(lang)) {
    return frDefinition;
  } else {
    return {};
  }
}
let userLang = navigator.language;

const App = () => {
  let [definition, setDefinition] = useState(getDefinition(userLang));
  function swapLang() {
    if (userLang.slice(0, 2) === 'en') {
      userLang = 'fr';
    } else {
      userLang = 'en';
    }
    setDefinition(getDefinition(userLang))
  }
  return (
    <IntlProvider definition={definition}>
      <div id="app">
        <Header swapLang={swapLang} />
        <Router>
          <Home path="/" />
          <Results path="/results" />
          <Form path="/form" />
        </Router>
      </div>
    </IntlProvider>
  );
};

export default App;
