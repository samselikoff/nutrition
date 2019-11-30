import React from "react";
import ReactDOM from "react-dom";
import "@reach/dialog/styles.css";
import "./index.css";
import App from "./components/App";
import { makeServer } from "./server";
import { Provider, createClient } from "urql";

const client = createClient({
  url: "https://nutrition-backend.herokuapp.com/v1/graphql"
});

if (process.env.NODE_ENV === "development") {
  // makeServer();
}

let currentVersion = process.env.REACT_APP_COMMIT_REF;

if (process.env.NODE_ENV === "production") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      fetch(`/index.html?_=${Date.now()}`)
        .then(res => res.text())
        .then(htmlString => {
          let doc = new DOMParser().parseFromString(htmlString, "text/html");
          let latestVersion = doc
            .querySelector("meta[name='app-version']")
            .getAttribute("content");

          if (latestVersion !== currentVersion) {
            window.location.reload(true);
          }
        });
    }
  });
}

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById("root")
);
