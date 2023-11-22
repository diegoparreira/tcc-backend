const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/categoryController');
const { handleResponse, handleError } = require('../util/util');

// Listar todas as categorias
categoryRouter.get('/', async (req, res) => {
    try {
        const categories = await categoryController.findAllCategory();
        res.status(200).json(categories);
    } catch (error) {
        const { sqlMessage, code } = error.parent;

        res.status(500).json(handleError('ERROR', sqlMessage, code));
        return;
    }
});

// Listar todas as categorias para ativar
categoryRouter.get('/toapprove', async (req, res) => {
  try {
      const categories = await categoryController.findAllCategoryToApprove();
      res.status(200).json(categories);
  } catch (error) {
      const { sqlMessage, code } = error.parent;

      res.status(500).json(handleError('ERROR', sqlMessage, code));
      return;
  }
});

// Criar categoria
categoryRouter.post('/', async (req, res) => {
    const { body } = req;

    try {
      
      const newCategory = await categoryController.createCategory(body);
      
      res.status(201).json(newCategory);
    } catch (error) {
      const { sqlMessage, code } = error.parent;
  
      res.status(500).json(handleError('ERROR', sqlMessage, code));
      return;
    }
});

// Aprovar uma lista de categorias
categoryRouter.post('/approve', async (req, res) => {
    const { ids } = req.body;
    console.log(ids);
  
    try{
      const result = await categoryController.approveCategoryList(ids);
      
      res.status(200).json(handleResponse('SUCCESS'));
    }catch(error){
      console.error(error);
      const { sqlMessage, code } = error.parent;
  
      res.status(500).json(handleError('ERROR', sqlMessage, code));
      return;
    }
});

module.exports = categoryRouter;