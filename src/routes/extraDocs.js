const express = require('express');
const extraDocsRouter = express.Router();
const extraDocsController = require('../controllers/extraDocController');
const { sendResponse } = require('../util/util');

/**
 * @swagger
 * tags:
 *   name: ExtraDocs
 *   description: API para gerenciar documentos extras
 */

/**
 * @swagger
 * /extraDocs:
 *   get:
 *     summary: Recuperar todos os documentos extras
 *     tags: [ExtraDocs]
 *     responses:
 *       200:
 *         description: Uma lista de documentos extras
 *       500:
 *         description: Erro do servidor
 */
extraDocsRouter.get('/', async (req, res) => {
    try {
        const extraDocs = await extraDocsController.findAllExtraDocs();
        sendResponse(res, "ExtraDocs", extraDocs, "GET");
    } catch (error) {
        sendResponse(res, "ExtraDocs", error.message, "SERVER_ERROR");
    }
});

/**
 * @swagger
 * /extraDocs/{id}:
 *   get:
 *     summary: Recuperar documentos extras por conteúdo
 *     tags: [ExtraDocs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Uma lista de documentos extras para o conteúdo
 *       500:
 *         description: Erro do servidor
 */
extraDocsRouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const extraDocsForContent = await extraDocsController.findExtraDocsByContentId(id);
        sendResponse(res, "ExtraDocs", extraDocsForContent, "GET");
    } catch (error) {
        sendResponse(res, "ExtraDocs", error.message, "SERVER_ERROR");
    }
});

/**
 * @swagger
 * /extraDocs:
 *   post:
 *     summary: Criar um documento extra
 *     tags: [ExtraDocs]
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
 *               description: O conteúdo do documento extra
 *     responses:
 *       201:
 *         description: O documento extra criado
 *       500:
 *         description: Erro do servidor
 */
extraDocsRouter.post('/', async (req, res) => {
    const { body } = req;

    try {
        const newDoc = await extraDocsController.createExtraDoc(body);
        sendResponse(res, "ExtraDoc", newDoc, "CREATE");
    } catch (error) {
        sendResponse(res, "ExtraDoc", error.message, "SERVER_ERROR");
    }
});

/**
 * @swagger
 * /extraDocs/{id}:
 *   put:
 *     summary: Aprovar um documento extra
 *     tags: [ExtraDocs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucesso
 *       500:
 *         description: Erro do servidor
 */
extraDocsRouter.put('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = extraDocsController.approveDoc(id);
        sendResponse(res, "ExtraDoc", null, "UPDATE");
    } catch (error) {
        sendResponse(res, "ExtraDoc", error.message, "SERVER_ERROR");
    }
});

module.exports = extraDocsRouter;