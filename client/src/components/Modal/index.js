import "./index.scss";
import { createElement } from "../../util/domUtil";
import request from "@util/fetchUtil.js";

export const makeAlertModalElement = ($taskCard) => {
  const $alertModal = createElement("div", "modal-container");
  $alertModal.innerHTML = getInnerTemplate();
  activateElement($alertModal, $taskCard);
  return $alertModal;
};

const getInnerTemplate = () => {
  return `
      <div class="modal">
        <h3 class="modal__message">선택한 카드를 삭제할까요?</h3>
        <div class="util__btns">
          <button class="util__btn--big util__btn--cancel">취소</button>
          <button class="util__btn--big util__btn--confirm">삭제</button>
        </div>
      </div>
    `;
};

const activateElement = ($alertModal, $taskCard) => {
  const $cancelBtn = $alertModal.querySelector(".util__btn--cancel");
  const $confirmBtn = $alertModal.querySelector(".util__btn--confirm");
  $cancelBtn.addEventListener("click", () => cancelDeleteCard($alertModal));
  $confirmBtn.addEventListener("click", () =>
    deleteCard($alertModal, $taskCard)
  );
};

const cancelDeleteCard = ($alertModal) => {
  $alertModal.remove();
};

const deleteCard = async ($alertModal, $taskCard) => {
  await request.deleteCard($taskCard.dataset.id);
  $alertModal.remove();
  $taskCard.dispatchEvent(new Event("changeCard", { bubbles: true }));
};
