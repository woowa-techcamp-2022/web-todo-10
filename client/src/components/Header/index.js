import "./index.scss";
import { createElement } from "@util/domUtil";

const makeHeaderElement = () => {
  const $header = createElement("header");
  $header.innerHTML = getInnerTemplate();
  return $header;
};

const getInnerTemplate = () => {
  return `
      <h1 class='header__title'>TO-DO LIST</h1>
    `;
};

export default makeHeaderElement;
