const bcrypt = require('bcrypt');
const { User } = require('../models/index');
const { Op, ValidationError } = require("sequelize");

const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        throw new Error("Erro ao gerar hash da senha.");
    }
}

const findUserById = async (id) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error(`Usuário com id: ${id} não encontrado.`);
        }
        return user;
    } catch (error) {
        throw error;
    }
}

const findAllUsers = async () => {
    try {
        const users = await User.findAll();
        if (!users.length) {
            throw new Error("Nenhum usuário encontrado.");
        }
        return users;
    } catch (error) {
        throw error;
    }
}

const findAllUsersWithMentorFlag = async () => {
    try {
        const users = await User.findAll({
            attributes: ["fullName", "email", "username", "type", "id"],
            where: {
                mentor_flag: 1
            }
        });
        if (!users.length) {
            throw new Error("Nenhum usuário com flag de mentor encontrado.");
        }
        return users;
    } catch (error) {
        throw error;
    }
}

const findUserByEmail = async (email) => {
    try {
        const users = await User.findAll({
            where: {
                email: email
            }
        });
        return users;
    } catch (error) {
        throw error;
    }
}

const findUserByUsername = async (username) => {
    try {
        const users = await User.findAll({
            where: {
                username: username
            }
        });
        if (!users.length) {
            throw new Error(`Nenhum usuário encontrado com o username: ${username}.`);
        }
        return users;
    } catch (error) {
        throw error;
    }
}

const createUser = async (body) => {
    try {
        const hashedPassword = await hashPassword(body.password);
        const newUser = await User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            username: body.username,
            password_hash: hashedPassword,
            birthdate: body.birthdate,
            avatar: body.avatar_url
        });
        return newUser;
    } catch (error) {
        if (error instanceof ValidationError) {
            const errors = error.errors.map((err) => ({
                message: err.message,
                type: err.type,
                path: err.path,
            }));
            throw new Error(JSON.stringify(errors));
        }
        throw new Error("Erro ao criar usuário.");
    }
}

const updateUserPassword = async (user, password) => {
    try {
        const hashedNewPassword = await hashPassword(password);
        user.set({
            password_hash: hashedNewPassword
        });
        return await user.save();
    } catch (error) {
        throw new Error("Erro ao atualizar senha do usuário.");
    }
}

const updateUserEmail = async (user, email) => {
    try {
        user.set({
            email: email
        });
        return await user.save();
    } catch (error) {
        throw new Error("Erro ao atualizar email do usuário.");
    }
}

const updateUserUsername = async (user, username) => {
    try {
        user.set({
            username: username
        });
        return await user.save();
    } catch (error) {
        throw new Error("Erro ao atualizar username do usuário.");
    }
}

const updateUserType = async (user, type) => {
    try {
        user.set({
            type: type
        });
        return await user.save();
    } catch (error) {
        throw new Error("Erro ao atualizar tipo do usuário.");
    }
}

const updateUserAvatar = async (user, newAvatar) => {
    try {
        user.set({
            avatar: newAvatar
        });
        return await user.save();
    } catch (error) {
        throw new Error("Erro ao atualizar avatar do usuário.");
    }
}

const updateUserMentorFlag = async (id) => {
    try {
        const [affectedCount] = await User.update(
            {
                mentor_flag: 1
            },
            {
                where: {
                    id: id
                }
            }
        )
        if (!affectedCount) {
            throw new Error(`Usuário com id: ${id} não encontrado.`);
        }
        return affectedCount;
    } catch (error) {
        throw error;
    }
}

const approveMentorUser = async (ids) => {
    try {
        const [affectedCount] = await User.update(
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
        if (!affectedCount) {
            throw new Error("Nenhum usuário encontrado para aprovar.");
        }
        return affectedCount;
    } catch (error) {
        throw error;
    }
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