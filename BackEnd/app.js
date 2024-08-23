const express = require('express');
const app = express();
const UserRouter = require('./routes/UserRouter');
const port = 3001;

app.use(express.json());

app.use(UserRouter);

app.listen(port, () => console.log(`Servidor rodando na porta: ${port}`));