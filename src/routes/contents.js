const express = require('express');
const contentRouter = express.Router();
const Content = require('../models/Content'); 

// Listar todos os conteúdos
contentRouter.get('/', async (req, res) => {
  try {
    const content = await Content.findAll();
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar conteúdos.' });
  }
});

// Obter um conteúdo por ID
contentRouter.get('/:id', async (req, res) => {
  // Implemente a busca por ID aqui
});

// Criar um novo conteúdo
contentRouter.post('/', async (req, res) => {
  // Implemente a criação de conteúdo aqui
  const { body } = req.body;

  try{
    const newContent = await Content.create({
      title: body.title,
      description: body.description,
      url: body.url,
      type: body.type,
      UserId: body.userId,
      CategoryId: body.categoryId
    });

    res.status(201).json(newContent);
  }
});

// Atualizar um conteúdo por ID
contentRouter.put('/:id', async (req, res) => {
  // Implemente a atualização de conteúdo aqui
});

// Deletar um conteúdo por ID
contentRouter.delete('/:id', async (req, res) => {
  // Implemente a exclusão de conteúdo aqui
});

module.exports = contentRouter;