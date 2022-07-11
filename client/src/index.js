import './index.scss';
import Header from '@/components/Header';
import TaskBoard from '@/components/TaskBoard';

function main() {
  const $app = document.querySelector('#app');
  new Header($app);
  new TaskBoard($app);
}

main();
