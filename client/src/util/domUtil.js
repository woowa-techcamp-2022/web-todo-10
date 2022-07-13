export const insertElementBefore = (targetElement, referenceElement) => {
  referenceElement.parentElement.insertBefore(targetElement, referenceElement);
};

export const insertElementAfter = (targetElement, referenceElement) => {
  referenceElement.parentNode.insertBefore(
    targetElement,
    referenceElement.nextSibling
  );
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
