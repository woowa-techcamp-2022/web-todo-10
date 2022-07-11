import './index.scss';
import Title from '@/components/Title';

function main() {
  const $app = document.querySelector('#app');
  const title = new Title($app);

  title.render();
}

main();
