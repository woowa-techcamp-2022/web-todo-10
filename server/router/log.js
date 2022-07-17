const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', getLogData);

async function getLogData(req, res) {
  const connection = await pool.getConnection();
  try {
    const [allLogData] = await connection.query(
      `SELECT * FROM activeLog ORDER BY idx DESC`
    );
    res.json(allLogData);
  } catch (err) {
    res.send(err);
  } finally {
    connection?.release();
  }
}

module.exports = router;
