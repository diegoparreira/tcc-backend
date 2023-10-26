const { Content } = require('../models/Content');
const userController = require('./userController');

const findAllContents = async () => {
    return await Content.findAll();
}

const findContentByUserId = async (id) => {
    const user = await userController.findUserById(id);

    if(!user[0]){
        return null;
    }

    return Content.findAll({
        where: {
            UserId: user[0].get(id)
        }
    });
}

const createContent = async (body) => {
    const newContent = await Content.create({
        title: body.title,
        description: body.description,
        url: body.url,
        type: body.type,
        UserId: body.userId,
        CategoryId: body.categoryId
    });

    return newContent;
}

const approveContent = async (id) => {
    return await Content.update({
        approved: 1
    }, {
        where: {
            id: id
        }
    });
}

module.exports = {
    findAllContents,
    findContentByUserId,
    createContent,
    approveContent
}