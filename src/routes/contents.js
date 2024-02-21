const express = require("express");
const contentRouter = express.Router();
const contentController = require("../controllers/contentController");
const { sendResponse } = require("../util/util");

// Middleware para verificar se o conteúdo existe
async function checkContentExists(req, res, next) {
  const { id } = req.params;
  const existingContent = await contentController.getContentById(id);
  if (!existingContent) {
    return sendResponse(res, "Conteúdos", null, "NOT_FOUND");
  }
  req.content = existingContent; // Armazena o conteúdo na solicitação para uso posterior
  next();
}

/**
 * @swagger
 * tags:
 *   name: Contents
 *   description: API para gerenciar conteúdos
 */

/**
 * @swagger
 * /contents/:
 *   get:
 *     summary: Listar todos os conteúdos
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Lista de todos os conteúdos
 *       404:
 *         description: Nenhum conteúdo encontrado
 *       500:
 *         description: Erro interno do servidor
 */
contentRouter.get("/", async (req, res) => {
  try {
    const contents = await contentController.getAllContents();
    if(contents.length > 0){
      sendResponse(res, "Conteúdos", contents, "GET");
    } else {
      sendResponse(res, "Conteúdos", null, "NOT_FOUND");
    }
  } catch (error) {
    sendResponse(res, "Conteúdos", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /contents/toapprove:
 *   get:
 *     summary: Listar todos os conteúdos para aprovação
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Lista de todos os conteúdos para aprovação
 *       404:
 *         description: Nenhum conteúdo para aprovação encontrado
 *       500:
 *         description: Erro interno do servidor
 */
contentRouter.get("/toapprove", async (req, res) => {
  try {
    const contents = await contentController.getAllUnaprovedContents();
    if(contents.length > 0){
      sendResponse(res, "Conteúdo para aprovação", contents, "GET");
    }else {
      sendResponse(res, "Conteúdo para aprovação", null, "NOT_FOUND");
    }
  } catch (error) {
    sendResponse(res, "Conteúdo", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /contents/bycategories:
 *   get:
 *     summary: Listar conteúdos por categoria
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Lista de conteúdos agrupados por categoria
 *       404:
 *         description: Nenhum conteúdo por categoria encontrado
 *       500:
 *         description: Erro interno do servidor
 */
contentRouter.get("/bycategories", async (req, res) => {
  try {
    const contents = await contentController.getContentGroupByCategories();
    
    // Check if there are contents
    if (contents && Object.keys(contents).length > 0) {
      sendResponse(res, "Conteúdo por categoria", contents, "GET");
    } else {
      sendResponse(res, "Conteúdo por categoria", null, "NOT_FOUND");
    }
    
  } catch (error) {
    sendResponse(res, "Conteúdo por categoria", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /contents/{userId}:
 *   get:
 *     summary: Obter todos os conteúdos de um usuário específico pelo ID do usuário
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário para recuperar seus conteúdos
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conteúdos do usuário especificado foram recuperados com sucesso
 *       404:
 *         description: Nenhum conteúdo encontrado para este usuário
 *       500:
 *         description: Erro interno do servidor
 */
contentRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const contents = await contentController.getContentByUserId(userId);

    if(contents.length > 0){
      sendResponse(res, "Conteúdo para o usuário com id: " + userId, contents, "GET");
    }else {
      sendResponse(res, "Conteúdo para o usuário com id: " + userId, null, "NOT_FOUND");
    }
  } catch (error) {
    sendResponse(res, "Conteúdo para o usuário com id: " + userId, error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /contents/:
 *   post:
 *     summary: Criar um novo conteúdo
 *     tags: [Contents]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Conteúdo a ser criado
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             url:
 *               type: string
 *             type:
 *               type: string
 *             userId:
 *               type: integer
 *             categoryId:
 *               type: integer
 *     responses:
 *       201:
 *         description: Conteúdo criado
 *       400:
 *         description: Erro ao criar conteúdo
 *       500:
 *         description: Erro interno do servidor
 */
contentRouter.post("/", async (req, res) => {
  const { body } = req;

  try {
    const newContent = await contentController.createContent(body);
    if(newContent){
      sendResponse(res, "Conteúdo", newContent, "CREATE");
    }else {
      sendResponse(res, "bad_request", "Conteúdo", null, "BAD_REQUEST");
    }
  } catch (error) {
    sendResponse(res, "Conteúdo", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /contents/approve:
 *   put:
 *     summary: Aprovar uma lista de conteúdos
 *     tags: [Contents]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: IDs dos conteúdos a serem aprovados
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             ids:
 *               type: array
 *               items:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Conteúdos aprovados
 *       400:
 *         description: Conteúdos não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
contentRouter.put("/approve", async (req, res) => {
  const { ids } = req.body;

  try {
    const affectedCount = await contentController.approveContentList(ids);

    if (affectedCount > 0) {
      sendResponse(res, "Conteúdo(s)", null, "APPROVE");
    } else {
      sendResponse(res, "Conteúdo(s)", null, "NOT_FOUND");
    }
  } catch (error) {
    sendResponse(res, "Conteúdo(s)", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /contents/{id}:
 *   put:
 *     summary: Alterar um conteúdo
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: The content ID.
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             description:
 *               type: string
 *     responses:
 *       200:
 *         description: Conteúdo alterado
 *       400:
 *         description: Conteúdo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

// Update content by ID
contentRouter.put("/:id", checkContentExists, async (req, res) => {
  const { body } = req;

  try {
    // Update content with new values
    for (let key in body) {
      req.content[key] = body[key];
    }
    // Return contet to be aprroved
    req.content["approved"] = 0;

    // Save changes in database
    const updatedContent = await req.content.save();

    sendResponse(res, "Conteúdo", updatedContent, "CHANGE");
  } catch (error) {
    sendResponse(res, "Conteúdo", error.message, "SERVER_ERROR");
  }
});

/**
 * @swagger
 * /contents/{id}:
 *   delete:
 *     summary: Deletar um conteúdo por ID
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do conteúdo a ser deletado
 *     responses:
 *       200:
 *         description: Conteúdo deletado com sucesso
 *       404:
 *         description: Conteúdo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

contentRouter.delete("/:id", checkContentExists, async (req, res) => {
  try {
    // Remove content from database
    const {content} = req;

    const result = await content.destroy();

    sendResponse(res, "Conteúdo", result, "DELETE");
  } catch (error) {
    sendResponse(res, "Conteúdo", error.message, "SERVER_ERROR");
  }
});

module.exports = contentRouter;
