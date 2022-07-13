export const taskTable = {
  1111: {
    id: 1111,
    title: 'GitHub 공부하기',
    details: ['add, commit, push'],
  },
  2222: {
    id: 2222,
    title: '블로그에 포스팅할 것',
    details: ['GitHub 공부내용', '모던 자바스크립트 1장 공부내용'],
    author: 'web',
  },
  3333: {
    id: 3333,
    title: '마크업',
    details: ['마크업 후딱 끝내자'],
    author: 'web',
  },
  4444: {
    id: 4444,
    title: '컴포넌트 나누기',
    details: ['수환님이랑 이야기한대로 나누자', '더 좋은 구조를 고민하자'],
    author: 'web',
  },
  5555: {
    id: 5555,
    title: '빌드 설정',
    details: ['웹팩 설정', '바벨 설정'],
    author: 'web',
  },
};

export const taskColumnTable = [
  {
    id: 1,
    columnName: '해야할 일',
    tasks: [1111, 2222],
  },
  {
    id: 2,
    columnName: '하고있는 일',
    tasks: [3333, 4444],
  },
  {
    id: 3,
    columnName: '한 일',
    tasks: [5555],
  },
];
