const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/categoryController');
const { handleResponse, handleError } = require('../util/util');

// List all categories
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

// Create category
categoryRouter.post('/', async (req, res) => {
    const { body } = req;

    try {
      
      const newCategory = await categoryController.createCategory(body);
      
      res.status(200).json(newCategory);
    } catch (error) {
      const { sqlMessage, code } = error.parent;
  
      res.status(500).json(handleError('ERROR', sqlMessage, code));
      return;
    }
});

// Aprovar um conteúdo
categoryRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
  
    try{
      const result = await categoryController.approveCategory(id);
      
      res.status(200).json(handleResponse('SUCCESS'));
    }catch(error){
      const { sqlMessage, code } = error.parent;
  
      res.status(500).json(handleError('ERROR', sqlMessage, code));
      return;
    }
});

module.exports = categoryRouter;