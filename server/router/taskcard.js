const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const pool = require('../config/database');
const createActiveLog = require('../util/dbQuery');

router.post('/', addNewCard);
router.patch('/:id', updateCardData);
router.delete('/:id', deleteCardData);
router.patch('/:id/move', moveCard);

async function addNewCard(req, res) {
  let connection;
  const { columnId, title, details } = req.body;

  try {
    connection = await pool.getConnection();

    const [[taskColumnData]] = await connection.query(
      `SELECT * FROM taskColumn WHERE idx = ${columnId}`
    );

    if (!taskColumnData) {
      res.json({
        status: 'NOT_FOUND',
        message: `잘못된 리스트 아이디입니다.`,
      });
    }

    const [newTaskData] = await connection.query(
      `INSERT INTO task (columnId, title, details) VALUES (${columnId}, "${title}", '${JSON.stringify(
        details
      )}')`
    );

    taskColumnData.taskIds.unshift(newTaskData.insertId);
    await connection.query(`
UPDATE taskColumn SET taskIds = '[${taskColumnData.taskIds}]' WHERE (idx = ${columnId})`);

    await createActiveLog(
      {
        originalColumnName: taskColumnData.name,
        taskTitle: title,
        actionType: 'ADD',
      },
      pool
    );

    res.json({
      status: 'OK',
      message: `정상적으로 추가되었습니다.`,
    });
  } catch (err) {
    res.send(err);
  } finally {
    connection?.release();
  }
}

async function updateCardData(req, res) {
  let connection;
  const { id: cardId } = req.params;
  const { title, details } = req.body;

  try {
    connection = await pool.getConnection();

    const [[taskData]] = await connection.query(
      `SELECT * FROM task WHERE id = ${cardId}`
    );
    const [[prevTaskColumnTable]] = await connection.query(
      `SELECT * FROM taskColumn WHERE idx = ${taskData.columnId}`
    );

    if (taskData.title !== title) {
      await createActiveLog(
        {
          originalColumnName: prevTaskColumnTable.name,
          prevTaskTitle: taskData.title,
          taskTitle: title,
          actionType: 'EDIT_TITLE',
          regDate: new Date(),
        },
        pool
      );
    } else if (taskData.details.join('').trim() !== details.join('').trim()) {
      await createActiveLog(
        {
          originalColumnName: prevTaskColumnTable.name,
          taskTitle: title,
          actionType: 'EDIT_CONTENT',
          regDate: new Date(),
        },
        pool
      );
    } else {
      return res.json({
        status: 'ok',
        message: '변경된 데이터가 없습니다',
      });
    }

    await connection.query(
      `UPDATE task SET title = "${title}", details = '${JSON.stringify(
        details
      )}', columnId = ${taskData.columnId} WHERE (id = ${cardId})`
    );
    if (connection) connection.release();
    res.json({ status: 'ok', message: '카드가 업데이트됐습니다.' });
  } catch (err) {
    res.json({ err });
  }
}

async function deleteCardData(req, res) {
  let connection;
  const { id: cardId } = req.params;

  try {
    connection = await pool.getConnection();
    //잘 나옴
    const [[targetTaskCard]] = await connection.query(
      `SELECT * FROM task WHERE id = ${cardId}`
    );

    //잘 나옴
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

    await createActiveLog(
      {
        originalColumnName: targetTaskColumn.name,
        taskTitle: targetTaskCard.title,
        actionType: 'DELETE',
        regDate: new Date(),
      },
      pool
    );

    res.json('카드가 삭제되었습니다.');
  } catch (err) {
    res.send(err);
  } finally {
    connection?.release();
  }
}

async function moveCard(req, res) {
  const { id: cardId } = req.params;
  const { originalColumnId, newColumnId, originalIdx, newIdx } = req.body;
  const connection = await pool.getConnection();
  try {
    //현재 카드의 부모를 새로운 부모로 바꿔준다.
    await connection.query(
      `UPDATE task SET columnId = ${newColumnId} WHERE (id = ${cardId})`
    );
    //현재 카드 부모에서 기존에 있던 카드를 지워준다.
    const [[originalTaskColumn]] = await connection.query(
      `SELECT * from taskColumn WHERE idx = ${originalColumnId}`
    );

    originalTaskColumn.taskIds.splice(originalIdx, 1);
    await connection.query(
      `UPDATE taskColumn SET taskIds = '[${originalTaskColumn.taskIds}]' WHERE (idx = ${originalColumnId})`
    );

    //이동할 카드 부모에서 추가해준다.
    const [[newTaskColumn]] = await connection.query(
      `SELECT * FROM taskColumn WHERE idx = ${newColumnId}`
    );
    newTaskColumn.taskIds.splice(newIdx, 0, +cardId);
    await connection.query(
      `UPDATE taskColumn SET taskIds ='[${newTaskColumn.taskIds}]' WHERE (idx = ${newColumnId})`
    );

    const [[taskData]] = await connection.query(
      `SELECT * FROM task WHERE id = ${cardId}`
    );

    await createActiveLog(
      {
        originalColumnName: originalTaskColumn.name,
        changedColumnName: newTaskColumn.name,
        taskTitle: taskData.title,
        actionType: 'MOVE',
      },
      pool
    );

    res.json({
      status: 'ok',
      message: '정상적으로 카드가 이동되었습니다.',
    });
  } catch (err) {
    res.send(err);
  } finally {
    connection?.release();
  }
}

module.exports = router;
