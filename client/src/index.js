import './index.scss';
import Header from '@/components/Header';
import TaskBoard from '@/components/TaskBoard';

function main() {
  const $app = document.querySelector('#app');
  const header = new Header($app);
  const taskBoard = new TaskBoard($app);

  header.render();
  taskBoard.render();
}

main();
