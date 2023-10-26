const { Category } = require('../models/Category');
const userController = require('./userController');

const findAllCategory = async () => {
    return await Category.findAll();
}

const createCategory = async (body) => {
    const newCategory = await Category.create({
        name: body.name,
        color: body.color,
        UserId: body.userId
    });

    return newCategory;
}

const approveCategory = async (id) => {
    return await Category.update({
        active: 1
    }, {
        where: {
            id: id
        }
    });
}

module.exports = {
    findAllCategory,
    createCategory,
    approveCategory
}