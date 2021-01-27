import { createContext, h } from "preact";
import { Router } from "preact-router";

import { IntlProvider } from "preact-i18n";
import frDefinition from "../i18n/fr.json";

import Header from "./header";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Form from "../routes/form";
import Results from "../routes/results";
import { useState } from "preact/hooks";

function getDefinition(lang) {
  return lang === 'fr' ? frDefinition : {};
}
let userLang = typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";
export const Language = createContext(userLang);

const App = () => {
  let [definition, setDefinition] = useState(getDefinition(userLang));

  function swapLang(lang= "en") {
    if (userLang.slice(0, 2) === "en") {
      userLang = "fr";
    } else {
      userLang = lang;
    }
    setDefinition(getDefinition(userLang));
  }
  return (
    <IntlProvider definition={definition}>
      <Language.Provider value={userLang}>
        <div id="app">
          <Header swapLang={swapLang} />
          <Router>
            <Home path="/" />
            <Results path="/results" />
            <Form path="/form" swapLang={swapLang} />
          </Router>
        </div>
      </Language.Provider>
    </IntlProvider>
  );
};

export default App;
