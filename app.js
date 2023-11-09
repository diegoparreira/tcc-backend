const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./config/database');

const { createUserData } = require('./src/models/User');
const { createContentData } = require('./src/models/Content');

// Importe as classes CRUD para as tabelas aqui
const userRouter = require('./src/routes/users');
const contentRouter = require('./src/routes/contents');
const categoryRouter = require('./src/routes/categories');
const extraDocRouter = require('./src/routes/extraDocs');
const commentRouter = require('./src/routes/comments');
const answerRouter = require('./src/routes/answers');

// Permitir a utilização de JSON nas requisições
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Defina as rotas principais do aplicativo
app.use('/users', userRouter);
app.use('/contents', contentRouter);
app.use('/categories', categoryRouter);
app.use('/extradocs', extraDocRouter);
app.use('/comments', commentRouter);
app.use('/answers', answerRouter);

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
        const port = process.env.PORT || 3003;

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