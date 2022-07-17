async function createActiveLog(logData, pool) {
  const connection = await pool.getConnection();
  const {
    originalColumnName,
    changedColumnName,
    editingColumnTitle,
    taskTitle,
    prevTaskTitle,
    actionType,
  } = logData;

  const regDate = new Date();
  await connection.query(
    `INSERT INTO activeLog (originalColumnName, changedColumnName, editingColumnTitle, taskTitle, prevTaskTitle, actionType, regDate) VALUES ("${originalColumnName}", "${changedColumnName}", "${editingColumnTitle}", "${taskTitle}", "${prevTaskTitle}", "${actionType}", "${regDate}")`
  );
  connection?.release();
}

module.exports = createActiveLog;
