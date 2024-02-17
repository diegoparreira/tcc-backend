const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const { Op } = require("sequelize");


const hashPassword = async (password) =>{
    return await bcrypt.hash(password, 10);
}

const findUserById = async (id) => {
    return await User.findByPk(id);
}

const findAllUsers = async () => {
    return await User.findAll();
}

const findAllUsersWithMentorFlag = async () => {
    return await User.findAll({
        attributes: ["fullName", "email", "username", "type", "id"],
        where: {
            mentor_flag: 1
        }
    });
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

const updateUserAvatar = async (user, newAvatar) => {

    user.set({
        avatar: newAvatar
    });

    return await user.save();
}

const updateUserMentorFlag = async (id) => {
    return await User.update(
        {
            mentor_flag: 1
        },
        {
            where: {
                id: id
            }
        }
    )
}

const approveMentorUser = async (ids) => {
    return await User.update(
        {
            type: 'mentor',
            mentor_flag: 0
        },
        {
            where: {
                id: {
                  [Op.in]: ids,
                },
              },
        }
    )
}

module.exports = { 
    findUserById,
    findAllUsers, 
    findAllUsersWithMentorFlag,
    findUserByEmail, 
    findUserByUsername,
    createUser,
    updateUserPassword,
    updateUserEmail,
    updateUserUsername,
    updateUserType,
    updateUserAvatar,
    updateUserMentorFlag,
    approveMentorUser
};