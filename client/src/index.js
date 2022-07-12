import './index.scss';
import Header from '@/components/Header';
import { makeTaskBoardElement } from '@/components/TaskBoard';

function main() {
  const $app = document.querySelector('#app');
  new Header($app);
  $app.append(makeTaskBoardElement());
}

main();
