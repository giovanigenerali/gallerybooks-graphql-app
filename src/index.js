import React from "react";
import ReactDOM from "react-dom";
import {
  Provider,
  createClient,
  defaultExchanges,
  subscriptionExchange,
} from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";

import "./index.css";

import App from "./App";

const subscriptionClient = new SubscriptionClient(
  process.env.REACT_APP_WS_URL,
  {}
);

const client = createClient({
  url: process.env.REACT_APP_API_URL,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
