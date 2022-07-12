import './index.scss';
import { makeTaskCardListElement } from './TaskCardList';

export const makeTaskBoardElement = () => {
  const $taskBoard = document.createElement('section');
  $taskBoard.className = 'task-board';

  dummyDatas.forEach((taskListData) =>
    $taskBoard.append(makeTaskCardListElement(taskListData))
  );
  return $taskBoard;
};

const dummyDatas = [
  {
    listName: '해야할 일',
    tasks: [
      {
        title: 'GitHub 공부하기',
        details: ['add, commit, push'],
        author: 'web',
      },
      {
        title: '블로그에 포스팅할 것',
        details: ['GitHub 공부내용', '모던 자바스크립트 1장 공부내용'],
        author: 'web',
      },
    ],
  },
  {
    listName: '하고있는 일',
    tasks: [
      {
        title: '마크업',
        details: ['마크업 후딱 끝내자'],
        author: 'web',
      },
      {
        title: '컴포넌트 나누기',
        details: ['수환님이랑 이야기한대로 나누자', '더 좋은 구조를 고민하자'],
        author: 'web',
      },
    ],
  },
  {
    listName: '한 일',
    tasks: [
      {
        title: '빌드 설정',
        details: ['웹팩 설정', '바벨 설정'],
        author: 'web',
      },
    ],
  },
];
