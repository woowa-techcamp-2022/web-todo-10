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
  const targetList = taskListDatas.find((listData) => listData.id === +listId);
  if (!targetList) {
    ctx.status(404),
      ctx.json({
        status: 'NOT_FOUND',
        message: '잘못된 리스트 아이디입니다.',
      });
  }
  targetList.tasks.unshift(newTaskCard);
  return res(ctx.status(200), ctx.json(targetList));
};

const handlers = [
  rest.get('/api/tasklists', getAllTaskList),
  rest.post('/api/taskcard', addNewCard),
];
export default handlers;
