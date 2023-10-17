const express = require('express');
const app = express();
const sequelize = require('./config/database');

const {createData} = require('./src/models/User');

// Importe as classes CRUD para as tabelas aqui
const {userRouter} = require('./src/routes/users');
// const conteudosRouter = require('./routes/contents');
// const comentariosRouter = require('./routes/comments');
// const materiaisRouter = require('./routes/materials');
// const categoriasRouter = require('./routes/categories');

// Defina as rotas principais do aplicativo
app.use('/users', userRouter);
// app.use('/contents', conteudosRouter);
// app.use('/comments', comentariosRouter);
// app.use('/materials', materiaisRouter);
// app.use('/categories', categoriasRouter);

// Outras configurações e middleware do Express

// Inicializar o banco de dados
sequelize.sync({
  // logging: debug,
  force: true
}).then(() => {
  createData();
  console.log('Connection with database established successfuly');
}).catch((error) => {
  console.log('Unable to connect to the database, error: ' + error);
})

// Inicialize o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running server at port: ${port}`);
});