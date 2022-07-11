import './index.scss';
import TaskCardList from './TaskCardList';

export default class TaskBoard {
  #$taskBoard;
  #taskCardLists;

  constructor($parent) {
    this.$parent = $parent;
    this.#makeDOM();
    this.#render();
    this.#mountTaskLists();
  }

  #makeDOM() {
    this.#$taskBoard = document.createElement('section');
    this.#$taskBoard.className = 'task-board';
  }

  #render() {
    this.$parent.append(this.#$taskCardList);
  }

  #mountTaskLists() {
    // Todo: 실제로는 data를 API 요청으로 받아와야 함
    this.#taskCardLists = dummyDatas.map(
      (cardListData) => new TaskCardList(this.#$taskBoard, cardListData)
    );
  }
}

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
