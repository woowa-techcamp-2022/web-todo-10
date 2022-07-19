export const createElement = (elementType, className = '') => {
  const element = document.createElement(elementType);
  element.className = className;
  return element;
};

export const addOrRemoveClass = (element, className, doAdd = 'true') => {
  if (doAdd) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
};

export const insertElementBefore = (targetElement, referenceElement) => {
  referenceElement.parentElement.insertBefore(targetElement, referenceElement);
};

export const insertElementAfter = (targetElement, referenceElement) => {
  referenceElement.parentNode.insertBefore(
    targetElement,
    referenceElement.nextSibling
  );
};

export const replaceElement = (originalElement, newElement) => {
  originalElement.parentNode.replaceChild(newElement, originalElement);
};

export const hasClassName = (element, className) => {
  return element.classList.contains(className);
};

export const getElementIndex = (node) => {
  let idx = 0;
  while (node.previousSibling) {
    idx++;
    node = node.previousSibling;
  }
  return idx;
};

export const getElementPos = ($) => {
  const y = $.getBoundingClientRect().top;
  const x = $.getBoundingClientRect().left;
  return [x, y];
};
