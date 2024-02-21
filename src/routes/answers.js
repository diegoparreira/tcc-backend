const express = require("express");
const answerRouter = express.Router();
const answerController = require("../controllers/answerController");
const { sendResponse } = require("../util/util");

/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: API para gerenciar respostas
 */

/**
 * @swagger
 * /answers/toapprove:
 *   get:
 *     summary: Recuperar respostas não aprovadas
 *     tags: [Answers]
 *     responses:
 *       200:
 *         description: Uma lista de respostas não aprovadas
 *       404:
 *         description: Nenhuma resposta não aprovada encontrada
 *       500:
 *         description: Erro do servidor
 */
answerRouter.get("/toapprove", async (req, res) => {
  try {
    const answersUnaproved = await answerController.getAllUnapprovedAnswers();
    if (answersUnaproved.length > 0) {
      sendResponse(res, "Respostas a serem aprovadas", answersUnaproved, "GET");
    } else {
      sendResponse(res, "Respostas a serem aprovadas", null, "NOT_FOUND");
    }
  } catch (error) {
    sendResponse(res, "Respostas", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /answers/approve:
 *   put:
 *     summary: Aprovar uma lista de respostas
 *     tags: [Answers]
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
answerRouter.put("/approve", async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await answerController.approveAnswerList(ids);
    if (result > 0) {
      sendResponse(res, "Resposta(s)", null, "APPROVE");
    } else {
      sendResponse(res, "Resposta(s)", null, "NOT_FOUND");
    }
  } catch (error) {
    sendResponse(res, "Resposta(s)", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /answers/{id}:
 *   get:
 *     summary: Recuperar as respostas de um comentário
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Uma lista de respostas para o comentário
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro do servidor
 */
answerRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const answersForContent = await answerController.getAllAnswersForComment(
      id
    );
    if (answersForContent.length > 0) {
      sendResponse(res, "Respostas para o comentário com id: " + id, answersForContent, "GET");
    } else {
      sendResponse(res, "Respostas para o comentário com id: " + id, null, "NOT_FOUND");
    }
  } catch (error) {
    sendResponse(res, "Respostas", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /answers/:
 *   post:
 *     summary: Criar uma resposta
 *     tags: [Answers]
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
 *               description: O conteúdo da resposta
 *             UserId:
 *               type: integer
 *               description: O ID do usuário
 *             CommentId:
 *               type: integer
 *               description: O ID do comentário
 *     responses:
 *       201:
 *         description: A resposta criada
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro do servidor
 */
answerRouter.post("/", async (req, res) => {
  const { body } = req;
  try {
    const newAnswer = await answerController.createAnswer(body);
    if (newAnswer) {
      sendResponse(res, "Resposta", newAnswer, "POST");
    } else {
      sendResponse(res, "Resposta", null, "BAD_REQUEST");
    }
  } catch (error) {
    sendResponse(res, "Resposta", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /answers/{id}:
 *   delete:
 *     summary: Excluir uma resposta
 *     tags: [Answers]
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
answerRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await answerController.removeAnswer(id);
    if (result == 1) {
      sendResponse(res, "Resposta", null, "DELETE");
    } else {
      sendResponse(res, "Resposta", null, "NOT_FOUND");
    }
  } catch (error) {
    sendResponse(res, "Resposta", error.message, "SERVER_ERROR");
  }
});

module.exports = answerRouter;
