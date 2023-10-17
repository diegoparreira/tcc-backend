const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');


// Listar todos os usuários
userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// Obter um usuário por ID
userRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

// Criar um novo usuário
userRouter.post('/', async (req, res) => {
  const { body } = req;
  try {
    // Calcula o hash da senha
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    // Cria o usuário com a senha hash
    const newUser = new User({
      name: body.name,
      email: body.email,
      username: body.username,
      password: hashedPassword,
      birthdate: body.birthdate,
      userType: body.userType,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});

// Atualizar um usuário por ID
userRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }
    
    // Calcula o hash da nova senha, se estiver presente
    const newPassword = body.password;
    if (newPassword) {
      newPassword = await bcrypt.hash(newPassword, 10);
    }

    await User.findByIdAndUpdate(id, body);
    res.json({ message: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

// Deletar um usuário por ID
userRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioExistente = await User.findById(id);
    if (!usuarioExistente) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }
    await User.findByIdAndDelete(id);
    res.json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});

module.exports = {userRouter};