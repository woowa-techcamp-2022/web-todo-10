import { rest } from 'msw';
import { taskTable, taskColumnTable, logTable } from './mockTables';

const getAllTaskColumn = (_, res, ctx) => {
  const taskColumnTableArr = Object.values(taskColumnTable);
  const allTaskColumnData = taskColumnTableArr.map(
    ({ id, columnName, taskIds }) => {
      return {
        id,
        columnName,
        tasks: taskIds.map((taskId) => taskTable[taskId]),
      };
    }
  );
  return res(ctx.status(200), ctx.json(allTaskColumnData));
};

const getTaskColumn = (req, res, ctx) => {
  const { id: columnId } = req.params;
  const { id, columnName, taskIds } = taskColumnTable[columnId];
  const taskColumnData = {
    id,
    columnName,
    tasks: taskIds.map((taskId) => taskTable[taskId]),
  };
  return res(ctx.status(200), ctx.json(taskColumnData));
};

const getLog = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(logTable));
};

const addNewCard = (req, res, ctx) => {
  const { columnId, title, details } = req.body;
  const newCardId = new Date().getTime();
  const newTaskCard = {
    id: newCardId,
    columnId,
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
  const updateInfo = req.body;
  taskTable[cardId] = { ...taskTable[cardId], ...updateInfo };

  return res(
    ctx.status(200),
    ctx.json({
      status: 'OK',
      message: '정상 수정되었습니다',
    })
  );
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
  rest.get('/api/taskcolumns', getAllTaskColumn),
  rest.get('/api/taskcolumn/:id', getTaskColumn),
  rest.get('/api/log', getLog),
  rest.post('/api/taskcard', addNewCard),
  rest.patch('/api/taskcard/:id', updateCardData),
  rest.patch('/api/taskcard/:id/move', moveCard),
  rest.delete('/api/taskcard/:id', deleteCardData),
];
export default handlers;
