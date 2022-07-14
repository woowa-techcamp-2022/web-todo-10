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
  taskColumnTable[columnId].taskIds.unshift(newCardId);
  taskTable[newCardId] = newTaskCard;
  return res(
    ctx.status(200),
    ctx.json({
      status: 'OK',
      message: '정상 추가되었습니다',
    })
  );
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
  const columnId = taskTable[cardId].columnId;
  delete taskTable[cardId];
  taskColumnTable[columnId].taskIds = taskColumnTable[columnId].taskIds.filter(
    (id) => id !== +cardId
  );
  return res(
    ctx.status(200),
    ctx.json({
      status: 'OK',
      message: '정상 삭제되었습니다',
    })
  );
};

const moveCard = (req, res, ctx) => {
  const { id: cardId } = req.params;
  const { originalColumnId, newColumnId, originalIdx, newIdx } = req.body;
  taskTable[cardId].columnId = newColumnId;
  taskColumnTable[originalColumnId].taskIds.splice(originalIdx, 1);
  taskColumnTable[newColumnId].taskIds.splice(newIdx, 0, +cardId);
  return res(
    ctx.status(200),
    ctx.json({
      status: 'OK',
      message: '정상 이동되었습니다',
    })
  );
};

const handlers = [
  rest.get('/api/tasklists', getAllTaskList),
  rest.post('/api/taskcard', addNewCard),
  rest.patch('/api/taskcard/:id', updateCardData),
  rest.patch('/api/taskcard/:id/move', moveCard),
  rest.delete('/api/taskcard/:id', deleteCardData),
];
export default handlers;
