import "./index.scss";
import { makeLogMenuItemElement } from "./LogMenuItem";
import { createElement, addOrRemoveClass, hasClassName } from "@util/domUtil";
import request from "@util/fetchUtil";

export const makeLogMenuElement = () => {
  const $logMenu = createElement("div", "log-menu closed");
  $logMenu.innerHTML = getInnerTemplate();
  activateElement($logMenu);
  return $logMenu;
};

const getInnerTemplate = () => {
  const openBtnTemplate = getOpenBtnTemplate();
  const logItemContainerTemplate = getLogItemContainerTemplate();
  return openBtnTemplate + logItemContainerTemplate;
};

const getOpenBtnTemplate = () => {
  return `<button class='log-menu__btn log-menu__btn--open'></button>`;
};

const getLogItemContainerTemplate = () => {
  return `
    <div class='log-container closed'>
      <button class='log-menu__btn log-menu__btn--close'></button>
      <ul class='log-items'></ul>
    </div>
  `;
};

const activateElement = ($logMenu) => {
  $logMenu.addEventListener("click", (e) => handleLogMenuClick($logMenu, e));
};

const handleLogMenuClick = ($logMenu, { target }) => {
  const menuState = determineMenuState(target);
  if (menuState === "STAY") return;
  const isOpen = menuState === "OPEN";
  if (isOpen) updateLogItems($logMenu);
  openAndCloseMenu($logMenu, isOpen);
};

const determineMenuState = (clickedElement) => {
  if (hasClassName(clickedElement, "log-menu__btn--open")) {
    return "OPEN";
  }
  if (
    hasClassName(clickedElement, "log-menu__btn--close") ||
    !clickedElement.closest(".log-container")
  ) {
    return "CLOSE";
  }
  return "STAY";
};

const openAndCloseMenu = ($logMenu, isOpen) => {
  const $logContainer = $logMenu.querySelector(".log-container");
  addOrRemoveClass($logContainer, "closed", !isOpen);
  addOrRemoveClass($logMenu, "closed", !isOpen);
};

const updateLogItems = async ($logMenu) => {
  const logDatas = await request.getLog();
  const $logItems = $logMenu.querySelector(".log-items");
  $logItems.innerHTML = "";
  logDatas.forEach((logData) => {
    $logItems.append(makeLogMenuItemElement(logData));
  });
};
