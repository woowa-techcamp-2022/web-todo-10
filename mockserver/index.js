//단일 리스트 불러오기
const getTaskList = async (listName) => {
  return await fetch(`http://localhost:5001/${listName}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
};

//단체 리스트 불러오기
const getAllTaskList = async () => {
  const listNames = ['Todo', 'Ondoing', 'Done'];
  const responseArr = [];
  for (let listName of listNames) {
    responseArr.push(await getTaskList(listName));
  }
  return responseArr;
};

//Task 추가
const postTask = async (listName, data) => {
  await fetch(`http://localhost:5001/${listName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  }).catch((err) => console.log('이미 존재하는 id입니다.'));
};

//Task 수정
const updateTask = async (listName, id, data) => {
  await fetch(`http://localhost:5001/${listName}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }).catch((err) => console.log('없는 id입니다s'));
};

//Task 삭제
const deleteTask = async (listName, id) => {
  await fetch(`http://localhost:5001/${listName}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).catch((err) => console.log('없는 id입니다'));
};

//테스팅

function app() {
  const init = async () => {
    const TodoData = await getTaskList('Todo');
    console.log(TodoData);

    const allTaskData = await getAllTaskList();
    console.log(allTaskData);

    await postTask('Done', {
      id: '5',
      title: '암호화 복호화 공부하기',
      task: ['책 참고하며 공부하기'],
    });
    await updateTask('Ondoing', 4, {
      id: '4',
      title: 'Npm 익히기',
      task: ['참고문서 확인하기'],
    });
    await deleteTask('Done', 5);
  };

  init();
}

app();
