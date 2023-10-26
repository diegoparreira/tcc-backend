const express = require('express');
const extraDocsRouter = express.Router();
const extraDocsController = require('../controllers/extraDocController');
const { handleResponse, handleError } = require('../util/util');


extraDocsRouter.get('/', async (req, res) => {
    try {
        const extraDocs = await extraDocsController.findAllExtraDocs();

        res.status(200).json(extraDocs);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
})

extraDocsRouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const extraDocsForContent = await extraDocsController.findExtraDocsByContentId(id);

        res.status(200).json(extraDocsForContent);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

extraDocsRouter.post('/' , async (req, res) => {
    const {body} = req;

    try {
        const newDoc = await extraDocsController.createExtraDoc(body);

        res.status(200).json(newDoc);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

extraDocsRouter.put('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = extraDocsController.approveDoc(id);

        res.status(200).json(handleResponse('SUCCESS'));

    } catch (error) {
        const { sqlMessage, code } = error.parent;
  
        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;        
    }
})


module.exports = extraDocsRouter;