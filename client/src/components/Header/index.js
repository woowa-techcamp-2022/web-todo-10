import './index.scss';

export const makeHeaderElement = () => {
  const $header = document.createElement('header');
  $header.className = 'header';
  $header.innerHTML = getInnerTemplate();
  return $header;
};

const getInnerTemplate = () => {
  return `
      <h1 class='header__title'>TO-DO LIST</h1>
    `;
};
