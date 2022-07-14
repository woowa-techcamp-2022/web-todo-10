import { rest } from 'msw';
import taskListDatas from './mockData';

const getAllTaskList = (_, res, ctx) => {
  return res(ctx.status(200), ctx.json(taskListDatas));
};

const addNewCard = (req, res, ctx) => {
  const { listId, title, details } = req.body;
  const newTaskCard = {
    id: new Date().getTime(),
    title,
    details,
    author: 'web',
  };
  const targetList = taskListDatas.find((listData) => listData.id == +listId);
  if (!targetList) {
    return res(
      ctx.status(404),
      ctx.json({
        status: 'NOT_FOUND',
        message: `잘못된 리스트 아이디입니다.${(listId, title, details)}`,
      })
    );
  }
  targetList.tasks.unshift(newTaskCard);
  return res(ctx.status(200), ctx.json(targetList));
};

const updateCardData = (req, res, ctx) => {
  const { id: cardId } = req.params;
  const { title, details, listId } = req.body;

  //sql 학습을 아직 진행하지 않아 막짜둔 로직.
  const targetList = taskListDatas.find((listData) => listData.id === +listId);
  const targetCard = targetList.tasks.find((task) => task.id === +cardId);
  targetCard.title = title;
  targetCard.details = details;
  return res(ctx.status(200), ctx.json(targetList));
};

const deleteCardData = (req, res, ctx) => {
  const { id: cardId } = req.params;
  const { listId } = req.body;

  //sql 학습을 아직 진행하지 않아 막짜둔 로직(poop...)
  const targetList = taskListDatas.find((listData) => listData.id === +listId);
  const deletedTasks = targetList.tasks.filter((task) => task.id !== +cardId);
  targetList.tasks = deletedTasks;
  return res(ctx.status(200), ctx.json(targetList));
};

const handlers = [
  rest.get('/api/tasklists', getAllTaskList),
  rest.post('/api/taskcard', addNewCard),
  rest.patch('/api/taskcard/:id', updateCardData),
  rest.delete('/api/taskcard/:id', deleteCardData),
];
export default handlers;
