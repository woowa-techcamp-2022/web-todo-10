import './index.scss';
import Header from '@/components/Header';
import TaskBoard from '@/components/TaskBoard';

function main() {
  const $app = document.querySelector('#app');
  new Header($app);
  const taskBoard = new TaskBoard($app);

  taskBoard.render();
}

main();
