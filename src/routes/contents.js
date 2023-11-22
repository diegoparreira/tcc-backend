const express = require('express');
const contentRouter = express.Router();
const contentController = require('../controllers/contentController'); 
const { handleResponse, handleError } = require('../util/util');

// Listar todos os conteúdos
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

// Listar todos os conteúdos não aprovados
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

// Listar conteúdos por categoria
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

// Obter um conteúdo por ID usuário
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

// Criar um novo conteúdo
contentRouter.post('/', async (req, res) => {
  const { body } = req;

  try {
    
    const newContent = await contentController.createContent(body);
    
    res.status(201).json(newContent);
  } catch (error) {
    const { sqlMessage, code } = error.parent;

    res.status(500).json(handleError('ERROR', sqlMessage, code));
    return;
  }
});

// Aprovar uma lista de conteúdos
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