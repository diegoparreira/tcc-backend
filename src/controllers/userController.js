const bcrypt = require('bcrypt');
const { User } = require('../models/User');

const hashPassword = async (password) =>{
    return await bcrypt.hash(password, 10);
}

const findUserById = async (id) => {
    return await User.findByPk(id);
}

const findAllUsers = async () => {
    return await User.findAll();
}

const findUserByEmail = async (email) => {
    return await User.findAll({
        where: {
            email: email
        }
    });
}

const findUserByUsername = async (username) => {
    return await User.findAll({
        where: {
            username: username
        }
    });
}

const createUser = async (body) => {
    // Calcula o hash da senha
    const hashedPassword = await hashPassword(body.password);

    // Cria o usuário com a senha hash
    const newUser = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        username: body.username,
        password_hash: hashedPassword,
        birthdate: body.birthdate
    });

    return newUser;
}

const updateUserPassword = async (user, password) => {
    const hashedNewPassword = await hashPassword(password);

    user.set({
        password_hash: hashedNewPassword
    });

    return await user.save();
}

const updateUserEmail = async (user, email) => {

    user.set({
        email: email
    });

    return await user.save();
}

const updateUserUsername = async (user, username) => {

    user.set({
        username: username
    });

    return await user.save();
}

const updateUserType = async (user, type) => {

    user.set({
        type: type
    });

    return await user.save();
}

module.exports = { 
    findUserById,
    findAllUsers, 
    findUserByEmail, 
    findUserByUsername,
    createUser,
    updateUserPassword,
    updateUserEmail,
    updateUserUsername,
    updateUserType
};