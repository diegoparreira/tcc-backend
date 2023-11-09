const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const { handleResponse, handleError } = require('../util/util');

// Listar todos os usuários
userRouter.get('/', async (req, res) => {
  try {
    const users = await userController.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

// Obter um usuário por email
userRouter.get('/:email', async (req, res) => {
  const { email } = req.params;
  console.log(email);
  try {
    const user = await userController.findUserByEmail(email);
    console.log(user);
    if (user.length === 0) {
      console.log('Não encontrou o usuário');
      res.status(404).json(handleResponse('NOT_FOUND'));
      return;
    }
    res.status(200).json(user[0]);
  } catch (error) {
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

// Criar um novo usuário
userRouter.post('/', async (req, res) => {
  console.log(req);
  const { body } = req;
  console.log(body);
  const { email } = body;

  try {
    // Verifica se o usuário já existe
    const user = await userController.findUserByEmail(email);

    console.log(user);

    if(user.length !== 0){
      res.status(400).json(handleResponse('EXISTENT_USER'));
      return;
    }

    const newUser = await userController.createUser(body);

    res.status(201).json(newUser);

  } catch (error) {
    const { sqlMessage, code } = error.parent;

    console.log("Debug error return");
    console.log(sqlMessage);
    console.log(code);

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

// Alterar senha do usuário
userRouter.put('/password', async (req, res) => {
  const { body } = req;
  const { email, password } = body;

  if(!password){
    res.status(400).json(handleResponse('MISSNG_PASSWORD'));
    return;
  }

  if(!email){
    res.status(400).json(handleResponse('MISSNG_EMAIL'));
    return;
  }

  try {
    const user = await userController.findUserByEmail(email);

    console.log('Usuário encontrado: ' + user[0]);

    if(user.length === 0){
      res.status(400).json(handleResponse('NOT_FOUND'));
      return;
    }

    const result = await userController.updateUserPassword(user[0], password);

    console.log('result');
    console.log(result);
        
    if(result) {
      res.status(200).json(handleResponse('SUCCESS'));
      return;
    }

  } catch (error) {
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

// Alterar email do usuário
userRouter.put('/email', async (req, res) => {
  const { body } = req;
  const { email, newEmail } = body;

  if(!newEmail){
    res.status(400).json(handleResponse('MISSING_EMAIL'));
    return;
  }

  if(!email){
    res.status(400).json(handleResponse('MISSING_EMAIL'));
    return;
  }

  try {
    const user = await userController.findUserByEmail(email);
    const anotherUserWithNewEmail = await userController.findUserByEmail(newEmail);

    // Check if has some user with the current email
    if(user.length === 0){
      res.status(400).json(handleResponse('NOT_FOUND'));
      return;
    }

    // Check if has some user with the new email
    if(anotherUserWithNewEmail.length !== 0) {
      res.status(400).json(handleResponse('EXISTENT_USER'));
      return;
    }

    const result = await userController.updateUserEmail(user[0], newEmail);

       
    if(result) {
      res.status(200).json(handleResponse('SUCCESS'));
      return;
    }

  } catch (error) {
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

// Alterar username do usuário
userRouter.put('/username', async (req, res) => {
  const { body } = req;
  const { username, newUsername } = body;

  if(!newUsername){
    res.status(400).json(handleResponse('MISSING_USERNAME'));
    return;
  }

  if(!username){
    res.status(400).json(handleResponse('MISSING_USERNAME'));
    return;
  }

  try {
    const user = await userController.findUserByUsername(username);
    const anotherUserWithNewUsername = await userController.findUserByUsername(newUsername);

    // Check if has some user with the current email
    if(user.length === 0){
      res.status(400).json(handleResponse('NOT_FOUND'));
      return;
    }

    // Check if has some user with the new email
    if(anotherUserWithNewUsername.length !== 0) {
      res.status(400).json(handleResponse('EXISTENT_USER'));
     return;
    }

    const result = await userController.updateUserUsername(user[0], newUsername);
        
    if(result) {
      res.status(200).json(handleResponse('SUCCESS'));
      return;
    }

  } catch (error) {
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

// Alterar tipo de usuário
userRouter.post('/type', async (req, res) => {
  const { body } = req;
  const { email, type } = body;

  const possibleTypes = ['admin', 'mentor', 'student'];

  try{
    if(!email){
      res.status(400).json(handleResponse('MISSING_EMAIL'))
      return;
    }
  
    if(!type){
      res.status(400).json(handleResponse('MISSING_TYPE'));
      return;
    }
  
    if(!possibleTypes.includes(type)){
      res.status(400).json(handleResponse('ENUM_ERROR'));
      return;
    }
  
    const user = await userController.findUserByEmail(email);
    console.log(user);
  
    if(!user[0]){
      res.status(400).json(handleResponse('NOT_FOUND'));
      return;
    }
  
    const result = await userController.updateUserType(user[0], type);
  
    if(result){
      res.status(200).json(handleResponse('SUCCESS'));
      return;
    }
  }catch(error){
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }

});

module.exports = userRouter;