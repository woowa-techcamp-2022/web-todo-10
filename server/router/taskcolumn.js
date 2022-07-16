const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const pool = require('../config/database');

router.get('/:id', getTaskColumn);
router.patch('/:id', updateColumnTitle);

async function getTaskColumn(req, res) {
  let connection;
  const { id: columnId } = req.params;
  try {
    connection = await pool.getConnection();

    const [[taskColumn]] = await connection.query(
      `SELECT * FROM taskColumn WHERE idx = ${columnId};`
    );

    findTaskDataByTaskIds(connection, taskColumn.taskIds).then((taskDatas) => {
      const taskColumnData = {
        id: columnId,
        columnName: taskColumn.name,
        tasks: taskDatas,
      };
      res.json(taskColumnData);
    });
  } catch {
    res.json('해당 이름을 가진 taskList가 존재하지 않습니다.');
  } finally {
    connection?.release();
  }
}

async function updateColumnTitle(req, res) {
  const { id: columnId } = req.params;
  const { title } = req.body;
  let connection;
  try {
    connection = await pool.getConnection();
    const [[targetTaskColumn]] = await connection.query(
      `SELECT * FROM taskColumn WHERE idx = ${columnId}`
    );
    await connection.query(
      `UPDATE taskColumn SET title = "${title}" WHERE (idx = ${columnId})`
    );
    await createActiveLog(
      {
        originalColumnName: targetTaskColumn.title,
        editingColumnTitle: title,
        actionType: 'EDIT-COLUMNTITLE',
        regDate: new Date(),
      },
      pool
    );
    res.json({ status: 'ok', message: '정상적으로 제목이 변경되었습니다.' });
  } catch (err) {
    res.send(err);
  } finally {
    connection?.release();
  }
}

async function findTaskDataByTaskIds(connection, taskIds) {
  const taskIdString = taskIds.join(',');
  const [taskDatas] = taskIdString.length
    ? await connection.query(
        `SELECT * FROM task WHERE id IN (${taskIdString}) ORDER BY FIELD(id, ${taskIdString})`
      )
    : [[]];
  return taskDatas;
}

module.exports = router;
