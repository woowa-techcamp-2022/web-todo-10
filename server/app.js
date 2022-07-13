const express = require('express');
const app = express();
const PORT = 5001;
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '3.38.160.215',
  user: 'kimsuhwan',
  password: 'soo199809',
  database: 'todolist',
});
const promisePool = pool.promise();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

async function getAllTaskColumn(req, res) {
  let connection;
  const taskLists = {};
  try {
    connection = await promisePool.getConnection();
    const [taskColumns, fields_taskColumn] = await connection.query(
      'SELECT * FROM taskColumn'
    );
    for (const taskColumn of taskColumns) {
      const curTasks = taskColumn.tasks.join(',');
      const [curTaskList, fields_task] = await connection.query(
        `SELECT * FROM task WHERE columnId IN (${curTasks}) ORDER BY FIELD(columnId, ${curTasks})`
      );
      taskLists[taskColumn.name] = curTaskList;
    }
  } catch (error) {
    res.send('제대로 taskLists를 받아오지 못했습니다.');
  } finally {
    if (connection) connection.release();
    res.json(taskLists);
  }
}

async function getTaskColumn(req, res) {
  let connection;
  const { columnName: columnName } = req.params;
  const taskList = {};

  try {
    connection = await promisePool.getConnection();
    const [taskColumn, fields_taskColumn] = await connection.query(
      `SELECT * FROM taskColumn WHERE name LIKE "${columnName}"`
    );

    const curTasks = taskColumn[0].tasks.join(',');
    const [curTaskList, fields_task] = await connection.query(
      `SELECT * FROM task WHERE columnId IN (${curTasks}) ORDER BY FIELD(columnId, ${curTasks})`
    );

    taskList['columnId'] = taskColumn[0].idx;
    taskList['columnName'] = columnName;
    taskList['tasks'] = curTaskList;
  } catch {
    res.send('해당 이름을 가진 taskList가 존재하지 않습니다.');
  } finally {
    if (connection) connection.release();
    res.json(taskList);
  }
}

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

app.get('/', getAllTaskColumn);
app.get('/:columnName', getTaskColumn);
