const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/categoryController');
const { sendResponse } = require('../util/util');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API para gerenciar categorias
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Uma lista de todas as categorias
 *       500:
 *         description: Erro do servidor
 */
categoryRouter.get('/', async (req, res) => {
    try {
        const categories = await categoryController.findAllCategory();
        sendResponse(res, "Categorias", categories, "GET");
    } catch (error) {
        sendResponse(res, "Categorias", error.message, "SERVER_ERROR");
    }
});

/**
 * @swagger
 * /categories/toapprove:
 *   get:
 *     summary: Listar todas as categorias para ativar
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Uma lista de todas as categorias para ativar
 *       500:
 *         description: Erro do servidor
 */
categoryRouter.get('/toapprove', async (req, res) => {
  try {
      const categories = await categoryController.findAllCategoryToApprove();
      sendResponse(res, "Categorias para aprovação", categories, "GET");
  } catch (error) {
      sendResponse(res, "Categorias", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Criar categoria
 *     tags: [Categories]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: O nome da categoria
 *             color:
 *               type: string
 *               format: hex
 *               description: A cor da categoria em hexadecimal
 *             UserId:
 *               type: integer
 *               description: O id do usuário responsável pela criação
 *     responses:
 *       201:
 *         description: A categoria criada
 *       500:
 *         description: Erro do servidor
 */
categoryRouter.post('/', async (req, res) => {
  const { body } = req;

  try {
    const newCategory = await categoryController.createCategory(body);
    sendResponse(res, "Categoria", newCategory, "CREATE");
  } catch (error) {
    sendResponse(res, "Categoria", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /categories/approve:
 *   put:
 *     summary: Aprovar uma lista de categorias
 *     tags: [Categories]
 *     parameters:
 *       - in: body
 *         name: ids
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Não encontrado
 *       500:
 *         description: Erro do servidor
 */
categoryRouter.put('/approve', async (req, res) => {
  const { ids } = req.body;

  try{
    const result = await categoryController.approveCategoryList(ids);
    if (result > 0) {
      sendResponse(res, "Categorias", null, "APPROVE");
    } else {
      sendResponse(res, "Categorias", null, "NOT_FOUND");
    }
  }catch(error){
    sendResponse(res, "Categorias", error.message, "SERVER_ERROR");
  }
});

module.exports = categoryRouter;