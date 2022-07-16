const express = require('express');
const app = express();
const PORT = 5001;
const path = require('path');

const logRouter = require('./router/log');
const taskcardRouter = require('./router/taskcard');
const taskcolumnRouter = require('./router/taskcolumn');
const taskcolumnsRouter = require('./router/taskcolumns');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/log', logRouter);
app.use('/api/taskcard', taskcardRouter);
app.use('/api/taskcolumn', taskcolumnRouter);
app.use('/api/taskcolumns', taskcolumnsRouter);

app.get('/*.js', function (req, res) {
  res.sendFile(path.join(process.cwd(), 'dist', 'main_bundle.js'));
});
app.get('/', function (req, res) {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
