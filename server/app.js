const express = require('express');
const app = express();
const PORT = 5001;
const mysql = require('mysql2');
const path = require('path');

const pool = mysql
  .createPool({
    host: '3.38.160.215',
    user: 'kimsuhwan',
    password: 'soo199809',
    database: 'todolist',
  })
  .promise();

async function getAllTaskColumn(req, res) {
  let connection;
  const allTaskColumnData = [];
  try {
    connection = await pool.getConnection();
    const [taskColumns] = await connection.query(`SELECT * FROM taskColumn`);
    for (const taskColumn of taskColumns) {
      const taskIdString = taskColumn.taskIds.join(',');
      const [taskDatas] = taskIdString.length
        ? await connection.query(
            `SELECT * FROM task WHERE id IN (${taskIdString}) ORDER BY FIELD(id, ${taskIdString})`
          )
        : [[]];

      allTaskColumnData.push({
        id: taskColumn.idx,
        columnName: taskColumn.name,
        tasks: taskDatas,
      });
    }

    if (connection) connection.release();

    res.json(allTaskColumnData);
  } catch (error) {
    res.json({ status: 404, message: '조회에 실패했습니다.' });
  }
}

async function getTaskColumn(req, res) {
  let connection;
  const { id: columnId } = req.params;
  const taskColumnData = {};
  try {
    connection = await pool.getConnection();

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
    res.json('해당 이름을 가진 taskList가 존재하지 않습니다.');
  }
}

async function addNewCard(req, res) {
  let connection;

  const { columnId, title, details } = req.body;
  const newTaskCard = {
    columnId,
    title,
    details,
  };
  try {
    connection = await pool.getConnection();

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
      `INSERT INTO task (columnId, title, details) VALUES (${columnId}, "${title}", '${JSON.stringify(
        details
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
    res.json('성공');
  } catch (err) {
    res.send(err);
  }
}

async function updateCardData(req, res) {
  let connection;
  const { id: cardId } = req.params;
  const { title, details, listId } = req.body;

  try {
    connection = await pool.getConnection();

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
      prevTaskData[0].details.join(' ').trim() !== details.join(' ').trim()
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
      `UPDATE task SET title = "${title}", details = '${JSON.stringify(
        details
      )}', columnId = ${listId} WHERE (id = ${cardId})`
    );
    if (connection) connection.release();
    res.json('카드가 업데이트됬습니다.');
  } catch (err) {
    res.send(err);
  }
}

async function deleteCardData(req, res) {
  let connection;
  const { id: cardId } = req.params;

  try {
    connection = await pool.getConnection();
    const [[targetTaskCard]] = await connection.query(
      `SELECT * FROM task WHERE id = ${cardId}`
    );
    const columnId = targetTaskCard.columnId;
    const [[targetTaskColumn]] = await connection.query(
      `SELECT * FROM taskColumn WHERE idx = ${columnId}`
    );
    const deletedTaskIds = targetTaskColumn.taskIds.filter(
      (id) => id !== +cardId
    );

    await connection.query(
      `UPDATE taskColumn SET taskIds = '[${deletedTaskIds}]' WHERE (idx = ${columnId})`
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
    res.json('카드가 삭제되었습니다.');
  } catch (err) {
    res.send(err);
  }
}

async function createActiveLog(logData) {
  const connection = await pool.getConnection();
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/api/taskcolumns', getAllTaskColumn);
app.get('/api/taskcolumn/:id', getTaskColumn);
app.post('/api/taskcard', addNewCard);
app.patch('/api/taskcard/:id', updateCardData);
app.delete('/api/taskcard/:id', deleteCardData);
app.get('/*.js', function (req, res) {
  res.sendFile(path.join(process.cwd(), 'dist', 'main_bundle.js'));
});
app.get('/', function (req, res) {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
