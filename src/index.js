import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { makeServer } from "./server";
import { Provider, createClient } from "urql";

const client = createClient({
  url: "https://nutrition-backend.herokuapp.com/v1/graphql"
});

if (process.env.NODE_ENV === "development") {
  // makeServer();
}

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById("root")
);
