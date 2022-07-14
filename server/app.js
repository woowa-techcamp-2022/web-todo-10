const express = require('express');
const app = express();
const PORT = 5001;
const mysql = require('mysql2');
const path = require('path');

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
  let allTaskColumnData = [];
  try {
    connection = await promisePool.getConnection();
    const [taskColumnTableArr, fields] = await connection.query(
      `SELECT * FROM taskColumn`
    );
    for (const taskColumnTable of taskColumnTableArr) {
      const taskColumnTableTaskIds = taskColumnTable.taskIds.join(',');
      const [taskDatas, fields] =
        taskColumnTableTaskIds.length > 0
          ? await connection.query(
              `SELECT * FROM task WHERE id IN (${taskColumnTableTaskIds}) ORDER BY FIELD(id, ${taskColumnTableTaskIds})`
            )
          : [[], []];
      allTaskColumnData.push({
        id: taskColumnTable.idx,
        columnName: taskColumnTable.name,
        tasks: taskDatas,
      });
    }

    if (connection) connection.release();

    res.json(allTaskColumnData);
  } catch (error) {
    res.send(error);
  }
}

async function getTaskColumn(req, res) {
  let connection;
  const { id: columnId } = req.params;
  const taskColumnData = {};
  try {
    connection = await promisePool.getConnection();

    const [taskColumnTable, fields_taskColumn] = await connection.query(
      `SELECT * FROM taskColumn WHERE idx = ${columnId};`
    );
    const taskColumnTableTaskIds = taskColumnTable[0].taskIds.join(',');

    const [taskDatas, fields_task] = await connection.query(
      `SELECT * FROM task WHERE id IN (${taskColumnTableTaskIds}) ORDER BY FIELD(id,${taskColumnTableTaskIds})`
    );

    taskColumnData.id = columnId;
    taskColumnData.columnName = taskColumnTable[0].name;
    taskColumnData.tasks = taskDatas;
    if (connection) connection.release();
    res.json(taskColumnData);
  } catch {
    res.send('해당 이름을 가진 taskList가 존재하지 않습니다.');
  }
}

async function addNewCard(req, res) {
  let connection;

  const { columnId, title, contents } = req.body;
  const newTaskCard = {
    columnId,
    title,
    contents,
  };
  try {
    connection = await promisePool.getConnection();

    const [taskColumnTable, fields_taskColumn] = await connection.query(
      `SELECT * FROM taskColumn WHERE idx = ${columnId}`
    );

    if (taskColumnTable.length === 0) {
      res.json({
        status: 'NOT_FOUND',
        message: `잘못된 리스트 아이디입니다.`,
      });
    }

    let [addingTaskData, field] = await connection.query(
      `INSERT INTO task (columnId, title, contents) VALUES (${columnId}, "${title}", '${JSON.stringify(
        contents
      )}')`
    );

    taskColumnTable[0].taskIds.unshift(addingTaskData.insertId);
    await connection.query(`
UPDATE taskColumn SET taskIds = '[${taskColumnTable[0].taskIds}]' WHERE (idx = ${columnId})`);

    /*await createActiveLog({
      originalColumnName: taskColumnTable[0].name,
      taskTitle: title,
      actionType: 'ADD',
      regDate: new Date().getTime(),
    });*/

    if (connection) connection.release();
    res.send('성공');
  } catch (err) {
    res.send(err);
  }
}

async function updateCardData(req, res) {
  let connection;
  const { id: cardId } = req.params;
  const { title, details, listId } = req.body;

  try {
    connection = await promisePool.getConnection();

    const [prevTaskData, field_prevTaskData] = await conneciton.query(
      `SELECT * FROM task WHERE id = ${cardId}`
    );
    const [prevTaskColumnTable, field_prevTaskColumnTable] =
      await connection.query(
        `SELECT * FROM taskColumn WHERE idx = ${prevTaskData[0].columnId}`
      );
    /*if (prevTaskData[0].title !== title) {
      await activeLog({
        originalColumnName: prevTaskColumnTable[0].name,
        taskTitle: title,
        actionType: 'EDIT_TITLE',
        regDate: new Date().getTime(),
      });
    } else if (
      prevTaskData[0].contents.join(' ').trim() !== details.join(' ').trim()
    ) {
      await activeLog({
        originalColumnName: prevTaskColumnTable[0].name,
        taskTitle: title,
        actionType: 'EDIT_CONTENT',
        regDate: new Date().getTime(),
      });
    } else {
      return;
    }*/

    await connection.query(
      `UPDATE task SET title = "${title}", contents = '${JSON.stringify(
        details
      )}', columnId = ${listId} WHERE (id = ${cardId})`
    );
    if (connection) connection.release();
    res.send('카드가 업데이트됬습니다.');
  } catch (err) {
    res.send(err);
  }
}

async function deleteCardData(req, res) {
  let connection;
  const { id: cardId } = req.params;
  const { listId } = req.body;
  try {
    connection = await promisePool.getConnection();
    const [prevTaskColumnData, fields] = await connection.query(
      `SELECT * FROM taskColumn WHERE idx = ${listId}`
    );
    await connection.query(
      `UPDATE taskColumn SET taskIds = '[${prevTaskColumnData[0].taskIds}]' WHERE (idx = ${listId})`
    );
    const [prevTaskData, field_prevTaskData] = await connection.query(
      `SELECT * FROM task WHERE id = ${cardId}`
    );
    await connection.query(`DELETE FROM task WHERE id = ${cardId}`);

    /*
    await createActiveLog({
      originalColumnName: prevTaskColumnData[0].name,
      taskTitle: prevTaskData[0].title,
      actionType: 'DELETE',
      regDate: new Date().getTime(),
    });*/

    if (connection) connection.release();
    res.send('카드가 삭제되었습니다.');
  } catch (err) {
    res.send(err);
  }
}

async function createActiveLog(logData) {
  const connection = await promisePool.getConnection();
  const {
    originalColumnName,
    changedColumnName,
    taskTitle,
    prevTaskTitle,
    actionType,
    regDate,
  } = logData;
  //ADD, MOVE, EDIT_TITLE, EDIT_CONTENT, DELETE
  const [activeLog, field_activeLog] = await connect.query(
    `INSERT INTO activeLog (originalColumnName, changedColumnName, taskTitle, prevTaskTitle, actionType, regDate) VALUES ("${originalColumnName}", "${changedColumnName}", "${taskTitle}", "${prevTaskTitle}", "${actionType}", "${regDate}")`
  );
  if (connection) connection.release();
}
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

app.get('/api/taskColumns', getAllTaskColumn);
app.get('/api/taskColumns/:id', getTaskColumn);
app.post('/api/taskCard', addNewCard);
app.patch('/api/taskCard/:id', updateCardData);
app.delete('/api/taskCard/:id', deleteCardData);
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '/client', '/dist', '/index.html'));
});
