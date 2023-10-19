const express = require('express');
const app = express();
const sequelize = require('./config/database');

const { createUserData } = require('./src/models/User')
const { createContentData } = require('./src/models/Content')

// Importe as classes CRUD para as tabelas aqui
const {userRouter} = require('./src/routes/users');
// const conteudosRouter = require('./routes/contents');
// const comentariosRouter = require('./routes/comments');
// const materiaisRouter = require('./routes/materials');
// const categoriasRouter = require('./routes/categories');

app.use(express.json());

// Defina as rotas principais do aplicativo
app.use('/users', userRouter);
// app.use('/contents', conteudosRouter);
// app.use('/comments', comentariosRouter);
// app.use('/materials', materiaisRouter);
// app.use('/categories', categoriasRouter);

// Outras configurações e middleware do Express

// Inicializar o banco de dados
const init = async () => {
  try {
    await sequelize.authenticate(); // Verifique a conexão com o banco de dados

    await sequelize
      // .sync({ force: true })
      .sync()
      .then(() => {
        // Inicialize o servidor
        const port = process.env.PORT || 3000;

        app.listen(port, () => {
          console.log(`Running server at port: ${port}`);
        });
      })
      .catch(err => console.log('Error: ' + err));

      // await createUserData();
      // await createContentData();
  } catch (error) {
    console.log('Unable to connect to the database, error: ' + error);
  }
}

init();