const express = require("express");
const answerRouter = express.Router();
const answerController = require("../controllers/answerController");
const { ValidationError } = require("sequelize");

// Middleware para lidar com erros
const errorHandler = async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ValidationError) {
      // Lidar com erro de validação aqui
      const messages = error.errors.map((e) => e.message);
      res.status(400).json({ status: "Erro de validação", messages });
    } else {
      // Lidar com erro genérico aqui
      const message = error.message;
      res.status(500).json({ status: "Erro", message });
    }
  }
};

answerRouter.use(errorHandler);

/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: API para gerenciar respostas
 */

/**
 * @swagger
 * /answer/toapprove:
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
    const answersUnaproved = await answerController.findAllUnapprovedAnswers();
    if (answersUnaproved.length > 0) {
      res.status(200).json(answersUnaproved);
    } else {
      res
        .status(404)
        .json({ message: "Nenhuma resposta não aprovada encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro do servidor", error: error.message });
  }
});

/**
 * @swagger
 * /answer/approve:
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
      res.status(200).json({ status: "Sucesso" });
    } else {
      res.status(404).json({
        status: "Erro",
        message: "Nenhuma resposta encontrada para aprovar.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro do servidor", error: error.message });
  }
});

/**
 * @swagger
 * /answer/{id}:
 *   get:
 *     summary: Recuperar as respostas de um post
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Uma lista de respostas para o post
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro do servidor
 */
answerRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const answersForContent = await answerController.findAllAnswersForComment(
      id
    );
    if (answersForContent.length > 0) {
      res.status(200).json(answersForContent);
    } else {
      res.status(404).json({ message: "Post não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro do servidor", error: error.message });
  }
});

/**
 * @swagger
 * /answer/:
 *   post:
 *     summary: Criar uma resposta
 *     tags: [Answers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: O conteúdo da resposta
 *               UserId:
 *                 type: integer
 *                 description: O ID do usuário
 *               CommentId:
 *                 type: integer
 *                 description: O ID do comentário
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
      res.status(201).json(newAnswer);
    } else {
      res.status(400).json({ message: "Dados inválidos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro do servidor", error: error.message });
  }
});

/**
 * @swagger
 * /answer/{id}:
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
      res.status(200).json({ status: "Sucesso" });
    } else {
      res.status(404).json({
        status: "Erro",
        message: "Nenhuma resposta encontrada para remover.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro do servidor", error: error.message });
  }
});

module.exports = answerRouter;
