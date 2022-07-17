import "./index.scss";
import { serviceWorker } from "@/mocks/browser.js";
import makeHeaderElement from "./components/Header";
import makeLogMenuElement from "./components/LogMenu";
import { makeTaskBoardElement } from "@/components/TaskBoard";
import request from "./util/fetchUtil.js";

async function main() {
  if (process.env.NODE_ENV === "development") {
    serviceWorker.start();
  }

  const $app = document.querySelector("#app");
  const taskListDatas = await request.allLists();
  $app.append(makeHeaderElement());
  $app.append(makeLogMenuElement());
  $app.append(makeTaskBoardElement(taskListDatas));
}

main();
