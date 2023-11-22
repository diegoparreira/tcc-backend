const express = require('express');
const commentRouter = express.Router();
const commentController = require('../controllers/commentController');
const { handleResponse, handleError } = require('../util/util');

// Recuperar comentários não aprovados
commentRouter.get('/toapprove', async (req, res) => {

    try {
        const commentsUnaproved = await commentController.findAllCommentsUnaproved();

        res.status(200).json(commentsUnaproved);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

// Aprovar uma lista de conteúdos
commentRouter.post('/approve', async (req, res) => {
    const { ids } = req.body;
  
    try{
      const result = await commentController.approveCommentList(ids);
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

// Recuperar comentários de determinado conteúdo
commentRouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const commentsForContent = await commentController.findAllCommentsForContent(id);

        res.status(200).json(commentsForContent);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

// Criar comentário
commentRouter.post('/', async (req, res) => {
    const { body } = req;

    try {
        const newComment = await commentController.createComment(body);

        res.status(201).json(newComment);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

// Excluir comentário
commentRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try{
        const result = await commentController.removeComment(id);

        if(result == 1){
            res.status(200).json(handleResponse('SUCCESS'));
        }else{
            res.status(404).json(handleResponse('NOT_FOUND'));
        }
    }catch(error){
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

module.exports = commentRouter;