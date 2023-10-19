const express = require('express');
const app = express();
const sequelize = require('./config/database');

const simpleUser = {
  "firstName": "Cleo",
  "lastName": "Cohen",
  "email": "a@hotmail.edu",
  "username": "Morbi",
  "password_hash": "OLI43ACB9RS",
  "birthdate": "2008-10-14 15:07:22"
};

const simpleContent = {
  "title": "odio. Aliquam vulputate",
  "description": "semper erat, in consectetuer ipsum nunc id enim. Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare tortor at risus.",
  "url": "https://youtube.com",
  "type": "video",
  "approved": "0",
  "userId": 1
}

const {User, createUserData} = require('./src/models/User');
const {Content, createContentData} = require('./src/models/Content');

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
const init = async () => {
  try {
    await sequelize.authenticate(); // Verifique a conexão com o banco de dados
    await sequelize.sync({ force: true }); // Sincronize os modelos com o banco de dados
    console.log('Connection with database established successfully');

    try{
      User.sync();
      Content.sync();
  
      User.hasMany(Content, {foreignKey: 'userId'});
      Content.belongsTo(User, {foreignKey: 'userId'});

      console.log('Sync and associations with success');

      // User.create(simpleUser);
      // Content.create(simpleContent);
    }catch(err){
      console.log('Error at sync and associate: ' + err);
    }
  } catch (error) {
    console.log('Unable to connect to the database, error: ' + error);
  }

  // Inicialize o servidor
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Running server at port: ${port}`);
  });
}

init();