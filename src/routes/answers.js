const express = require('express');
const answerRouter = express.Router();
const answerController = require('../controllers/answerController');
const { handleResponse, handleError } = require('../util/util');

// Recuperar respostas não aprovados
answerRouter.get('/toapprove', async (req, res) => {

    try {
        const answersUnaproved = await answerController.findAllAnswersUnaproved();

        res.status(200).json(answersUnaproved);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

// Aprovar uma lista de respostas
answerRouter.post('/approve', async (req, res) => {
    const { ids } = req.body;
  
    try{
      const result = await answerController.approveAnswerList(ids);
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

// Recuperar os comentários de um post
answerRouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const commentsForContent = await answerController.findAllAnswersForComment(id);

        res.status(200).json(commentsForContent);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

// Criar comentário
answerRouter.post('/', async (req, res) => {
    const { body } = req;

    try {
        const newComment = await answerController.createAnswer(body);

        res.status(201).json(newComment);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

// Excluir comentário
answerRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try{
        const result = await answerController.removeAnswer(id);

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

module.exports = answerRouter;