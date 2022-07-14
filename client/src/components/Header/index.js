import './index.scss';

export const makeHeaderElement = () => {
  const $header = document.createElement('header');
  $header.className = 'header';
  $header.innerHTML = getInnerTemplate();
  activateElement($header);
  return $header;
};

const getInnerTemplate = () => {
  return `
      <h1 class='header__title'>TO-DO LIST</h1>
      <button class='header__menu-btn'></button>
    `;
};

const activateElement = ($header) => {
  const $menuBtn = $header.querySelector('.header__menu-btn');
  $menuBtn.addEventListener('click', () => console.log('hi'));
};
