export const insertNodeBefore = (targetNode, referenceNode) => {
  referenceNode.parentNode.insertBefore(targetNode, referenceNode);
};

export const insertNodeAfter = (targetNode, referenceNode) => {
  referenceNode.parentNode.insertBefore(targetNode, referenceNode.nextSibling);
};

export const removeNodeself = (node) => {
  node.parentNode.removeChild(node);
};

export const hasClassName = (element, className) => {
  return element.classList.contains(className);
};

export const getNodeIndex = (node) => {
  let idx = 0;
  while (node.previousSibling) {
    idx++;
    node = node.previousSibling;
  }
  return idx;
};
