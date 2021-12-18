import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { ClickerApp } from "./ClickerApp";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ClickerApp />
  </StrictMode>,
  rootElement
);
