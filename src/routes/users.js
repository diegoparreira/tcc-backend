const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const {User} = require('../models/User');


// Listar todos os usuários
userRouter.get('/', async (req, res) => {
  try {
    // const users = await User.findAll();
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// Obter um usuário por email
userRouter.get('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findAll({
      where: {
        email: email
      }
    });
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
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      username: body.username,
      password_hash: hashedPassword,
      birthdate: body.birthdate
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});

// Atualizar um usuário por email
// Corrigir para só alterar os campos que devem permitir alteração
userRouter.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { body } = req;
  try {
    // const user = await User.findById(id);
    const user = await User.findAll({
      where: {
        email: email
      }
    });
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }
    
    // Calcula o hash da nova senha, se estiver presente
    const newPassword = body.password;
    if (newPassword) {
      body.password = await bcrypt.hash(newPassword, 10);
    }
    await User.update(body, {
      where: {
        email: email
      }
    })
    .then((result) => {
      if(result[0] > 0) {
        res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

// TODO: Alterar tipo de usuário

module.exports = {userRouter};