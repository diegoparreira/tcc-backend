const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const { sendResponse } = require('../util/util');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gerenciar usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Recuperar todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Uma lista de usuários
 *       500:
 *         description: Erro do servidor
 */
userRouter.get('/', async (req, res) => {
  try {
    const users = await userController.findAllUsers();
    sendResponse(res, "Usuários", users, "GET");
  } catch (error) {
    sendResponse(res, "Usuários", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /users/toapprove:
 *   get:
 *     summary: Recuperar todos os usuários querendo ser mentor
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Uma lista de usuários
 *       500:
 *         description: Erro do servidor
 */
userRouter.get('/toapprove', async (req, res) => {
  try {
    const users = await userController.findAllUsersWithMentorFlag();
    sendResponse(res, "Usuários", users, "GET");
  } catch (error) {
    sendResponse(res, "Usuários", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Recuperar um usuário por email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: O usuário recuperado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro do servidor
 */
userRouter.get('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userController.findUserByEmail(email);
    if (user.length === 0) {
      sendResponse(res, "User", null, "NOT_FOUND");
      return;
    }
    sendResponse(res, "User", user[0], "GET");
  } catch (error) {
    sendResponse(res, "User", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: O email do usuário
 *             firstName:
 *               type: string
 *               description: O primeiro nome do usuário
 *             lastName:
 *               type: string
 *               description: O sobrenome do usuário
 *             username:
 *               type: string
 *               description: O nome de usuário
 *             password:
 *               type: string
 *               description: A senha do usuário
 *             birthdate:
 *               type: string
 *               format: date
 *               description: A data de nascimento do usuário
 *             avatar_url:
 *               type: string
 *               description: A URL do avatar do usuário
 *     responses:
 *       201:
 *         description: O usuário criado
 *       400:
 *         description: Usuário já existe
 *       500:
 *         description: Erro do servidor
 */
userRouter.post('/', async (req, res) => {
  const { body } = req;
  const { email } = body;

  try {
    const user = await userController.findUserByEmail(email);

    if(user.length !== 0){
      sendResponse(res, "User", null, "EXISTENT_USER");
      return;
    }

    const newUser = await userController.createUser(body);

    sendResponse(res, "User", newUser, "CREATE");

  } catch (error) {
    sendResponse(res, "User", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /users/password:
 *   post:
 *     summary: Alterar senha do usuário
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: O email do usuário
 *             password:
 *               type: string
 *               description: A nova senha do usuário
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Email ou senha faltando
 *       500:
 *         description: Erro do servidor
 */
userRouter.post('/password', async (req, res) => {
  const { body } = req;
  const { email, password } = body;

  if(!password || !email){
    sendResponse(res, "User", null, "MISSING_FIELDS");
    return;
  }

  try {
    const user = await userController.findUserByEmail(email);

    if(user.length === 0){
      sendResponse(res, "User", null, "NOT_FOUND");
      return;
    }

    const result = await userController.updateUserPassword(user[0], password);
        
    if(result) {
      sendResponse(res, "User", null, "UPDATE");
      return;
    }

  } catch (error) {
    sendResponse(res, "User", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /users/email:
 *   put:
 *     summary: Alterar email do usuário
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: O email atual do usuário
 *             newEmail:
 *               type: string
 *               description: O novo email do usuário
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Email faltando ou já existente
 *       500:
 *         description: Erro do servidor
 */
userRouter.put('/email', async (req, res) => {
  const { body } = req;
  const { email, newEmail } = body;

  if(!newEmail || !email){
    sendResponse(res, "User", null, "MISSING_FIELDS");
    return;
  }

  try {
    const user = await userController.findUserByEmail(email);
    const anotherUserWithNewEmail = await userController.findUserByEmail(newEmail);

    if(user.length === 0 || anotherUserWithNewEmail.length !== 0){
      sendResponse(res, "User", null, "EXISTENT_USER");
      return;
    }

    const result = await userController.updateUserEmail(user[0], newEmail);

    if(result) {
      sendResponse(res, "User", null, "UPDATE");
      return;
    }

  } catch (error) {
    sendResponse(res, "User", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /users/username:
 *   put:
 *     summary: Alterar username do usuário
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: O username atual do usuário
 *             newUsername:
 *               type: string
 *               description: O novo username do usuário
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Username faltando ou já existente
 *       500:
 *         description: Erro do servidor
 */
userRouter.put('/username', async (req, res) => {
  const { body } = req;
  const { username, newUsername } = body;

  if(!newUsername || !username){
    sendResponse(res, "User", null, "MISSING_FIELDS");
    return;
  }

  try {
    const user = await userController.findUserByUsername(username);
    const anotherUserWithNewUsername = await userController.findUserByUsername(newUsername);

    if(user.length === 0 || anotherUserWithNewUsername.length !== 0){
      sendResponse(res, "User", null, "EXISTENT_USER");
      return;
    }

    const result = await userController.updateUserUsername(user[0], newUsername);

    if(result) {
      sendResponse(res, "User", null, "UPDATE");
      return;
    }

  } catch (error) {
    sendResponse(res, "User", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     summary: Alterar avatar do usuário
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: O id do usuário
 *             avatar:
 *               type: string
 *               description: O novo avatar do usuário
 *     responses:
 *       200:
 *         description: Sucesso
 *       500:
 *         description: Erro do servidor
 */
userRouter.post('/avatar', async (req, res) => {
  const { id, avatar } = req.body;

  try {
    const user = await userController.findUserById(id);

    const result = await userController.updateUserAvatar(user, avatar);

    if(result) {
      sendResponse(res, "User", null, "UPDATE");
      return;
    }

  } catch (error) {
    sendResponse(res, "User", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /users/type:
 *   post:
 *     summary: Alterar tipo de usuário
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: O email do usuário
 *             type:
 *               type: string
 *               description: O novo tipo do usuário
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Email ou tipo faltando
 *       500:
 *         description: Erro do servidor
 */
userRouter.post('/type', async (req, res) => {
  const { body } = req;
  const { email, type } = body;

  const possibleTypes = ['admin', 'mentor', 'student'];

  if(!email || !type || !possibleTypes.includes(type)){
    sendResponse(res, "User", null, "MISSING_FIELDS");
    return;
  }

  try {
    const user = await userController.findUserByEmail(email);

    if(!user[0]){
      sendResponse(res, "User", null, "NOT_FOUND");
      return;
    }

    const result = await userController.updateUserType(user[0], type);

    if(result){
      sendResponse(res, "User", null, "UPDATE");
      return;
    }
  }catch(error){
    sendResponse(res, "User", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /users/mentor:
 *   post:
 *     summary: Solicitar para ser mentor
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: O id do usuário
 *     responses:
 *       201:
 *         description: Sucesso
 *       500:
 *         description: Erro do servidor
 */
userRouter.post('/mentor', async (req, res) => {
  const { body } = req;
  const { id } = body;

  try{
    const result = await userController.updateUserMentorFlag(id);
  
    if(result){
      res.status(201).json(handleResponse('SUCCESS'));
      return;
    }
  }catch(error){
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

/**
 * @swagger
 * /users/approve:
 *   post:
 *     summary: Aprovar usuário como mentor
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             ids:
 *               type: array
 *               items:
 *                 type: string
 *               description: Os ids dos usuários
 *     responses:
 *       200:
 *         description: Sucesso
 *       500:
 *         description: Erro do servidor
 */
userRouter.post('/approve', async (req, res) => {
  const { body } = req;
  const { ids } = body;

  try{
    const result = await userController.approveMentorUser(ids);
  
    if(result){
      res.status(200).json(handleResponse('SUCCESS'));
      return;
    }
  }catch(error){
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
})

module.exports = userRouter;