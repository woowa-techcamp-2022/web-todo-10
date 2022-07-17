const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', getAllTaskColumn);

async function getAllTaskColumn(req, res) {
  const connection = await pool.getConnection();
  const allTaskColumnData = [];
  try {
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
    res.json(allTaskColumnData);
  } catch (error) {
    res.json({ status: 404, message: '조회에 실패했습니다.' });
  } finally {
    connection?.release();
  }
}

module.exports = router;
