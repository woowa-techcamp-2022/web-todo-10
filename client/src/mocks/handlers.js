import { rest } from 'msw';
import taskListDatas from './mockData';

const getAllTaskList = (_, res, ctx) => {
  return res(ctx.status(200), ctx.json(taskListDatas));
};

const test = (req, res, ctx) => {
  return;
};

const handlers = [rest.get('/api/tasklists', getAllTaskList)];
export default handlers;
