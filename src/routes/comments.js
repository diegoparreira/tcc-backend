const express = require('express');
const commentRouter = express.Router();
const commentController = require('../controllers/commentController');
const { sendResponse } = require('../util/util');

/**
 * @swagger
 * tags:
 *   name: Comentários
 *   description: API para gerenciar comentários
 */

/**
 * @swagger
 * /comments/toapprove:
 *   get:
 *     summary: Recuperar comentários não aprovados
 *     tags: [Comentários]
 *     responses:
 *       200:
 *         description: Uma lista de comentários não aprovados
 *       500:
 *         description: Erro do servidor
 */
commentRouter.get('/toapprove', async (req, res) => {
    try {
        const commentsUnaproved = await commentController.findAllCommentsUnaproved();
        sendResponse(res, "Comentários não aprovados", commentsUnaproved, "GET");
    } catch (error) {
        sendResponse(res, "Comentários", error.message, "SERVER_ERROR");
    }
});

/**
 * @swagger
 * /comments/approve:
 *   post:
 *     summary: Aprovar uma lista de comentários
 *     tags: [Comentários]
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
commentRouter.post('/approve', async (req, res) => {
    const ids = req.body;
  
    try{
      const result = await commentController.approveCommentList(ids);
      if(result[0] > 0){
        sendResponse(res, "Comentários", null, "APPROVE");
      }else {
        sendResponse(res, "Comentários", null, "NOT_FOUND");
      }
    }catch(error){
      sendResponse(res, "Comentários", error.message, "SERVER_ERROR");
    }
});

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Recuperar comentários de determinado conteúdo
 *     tags: [Comentários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Uma lista de comentários para o conteúdo
 *       500:
 *         description: Erro do servidor
 */
commentRouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const commentsForContent = await commentController.findAllCommentsForContent(id);
        sendResponse(res, "Comentários", commentsForContent, "GET");
    } catch (error) {
        sendResponse(res, "Comentários", error.message, "SERVER_ERROR");
    }
});

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Criar um comentário
 *     tags: [Comentários]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *               description: O conteúdo do comentário
 *             UserId:
 *               type: integer
 *               description: O id do usuário que criou o comentário
 *             ContentId:
 *               type: integer
 *               description: O id do conteúdo ao qual o comentário se refere
 *     responses:
 *       201:
 *         description: O comentário criado
 *       500:
 *         description: Erro do servidor
 */
commentRouter.post('/', async (req, res) => {
    const { body } = req;

    try {
        const newComment = await commentController.createComment(body);
        sendResponse(res, "Comentário", newComment, "CREATE");
    } catch (error) {
        sendResponse(res, "Comentário", error.message, "SERVER_ERROR");
    }
});

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Excluir um comentário
 *     tags: [Comentários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Não encontrado
 *       500:
 *         description: Erro do servidor
 */
commentRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try{
        const result = await commentController.removeComment(id);
        if(result == 1){
            sendResponse(res, "Comentários", null, "DELETE");
        }else{
            sendResponse(res, "Comentários", null, "NOT_FOUND");
        }
    }catch(error){
        sendResponse(res, "Comentários", error.message, "SERVER_ERROR");
    }
});

module.exports = commentRouter;