import './index.scss';
import Header from '@/components/Header';

function main() {
  const $app = document.querySelector('#app');
  const header = new Header($app);

  header.render();
}

main();
