const express = require('express');
const contentRouter = express.Router();
const contentController = require('../controllers/contentController'); 
const { handleResponse, handleError } = require('../util/util');

/**
 * @swagger
 * tags:
 *   name: Contents
 *   description: API para gerenciar conteúdos
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Listar todos os conteúdos
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Lista de todos os conteúdos
 */
contentRouter.get('/', async (req, res) => {
  try{
    const contents = await contentController.findAllContents();
    res.status(200).json(contents);
  }catch(error){
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

/**
 * @swagger
 * /toapprove:
 *   get:
 *     summary: Listar todos os conteúdos não aprovados
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Lista de todos os conteúdos não aprovados
 */
contentRouter.get('/toapprove', async (req, res) => {
  try{
    const contents = await contentController.findAllUnaprovedContents();
    res.status(200).json(contents);
  }catch(error){
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

/**
 * @swagger
 * /bycategories:
 *   get:
 *     summary: Listar conteúdos por categoria
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Lista de conteúdos agrupados por categoria
 */
contentRouter.get('/bycategories', async (req, res) => {
  try{
    const contents = await contentController.getContentGroupByCategories();
    res.status(200).json(contents);
  }catch(error){
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }  
})

/**
 * @swagger
 * /{userId}:
 *   get:
 *     summary: Obter um conteúdo por ID usuário
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conteúdo do usuário especificado
 */
contentRouter.get('/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const contents = await contentController.findContentByUser(userId);

    res.status(200).json(contents);
  } catch (error) {

    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

/**
 * @swagger
 * /:
 *   post:
 *     summary: Criar um novo conteúdo
 *     tags: [Contents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               type:
 *                 type: string
 *               userId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Conteúdo criado
 */
contentRouter.post('/', async (req, res) => {
  const { body } = req;

  try {
    
    const newContent = await contentController.createContent(body);
    
    res.status(201).json(newContent);
  } catch (error) {
    console.log('Debug do erro');
    console.log(error);

    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

/**
 * @swagger
 * /approve:
 *   post:
 *     summary: Aprovar uma lista de conteúdos
 *     tags: [Contents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Conteúdos aprovados
 *       400:
 *         description: Conteúdos não encontrados
 */
contentRouter.post('/approve', async (req, res) => {
  const { ids } = req.body;

  try{
    const result = await contentController.approveContentList(ids);
    console.log(result);

    if(result[0] > 0){
      res.status(200).json(handleResponse('SUCCESS'));
    }else {
      res.status(400).json(handleError('NOT_FOUND'));
    }
  }catch(error){
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
})

// Atualizar um conteúdo por ID
contentRouter.put('/:id', async (req, res) => {
  // Implemente a atualização de conteúdo aqui
});

// Deletar um conteúdo por ID
contentRouter.delete('/:id', async (req, res) => {
  // Implemente a exclusão de conteúdo aqui
});

module.exports = contentRouter;