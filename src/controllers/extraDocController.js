const { ExtraDoc } = require('../models/ExtraDoc');

const findAllExtraDocs = async () => {
    return await ExtraDoc.findAll();
}

const findExtraDocsByContentId = async (contentId) => {
    return await ExtraDoc.findAll({
        where: {
            ContentId: contentId
        }
    });
}

const createExtraDoc = async (body) => {
    return await ExtraDoc.create({
        title: body.title,
        link: body.link,
        UserId: body.userId,
        ContentId: body.contentId
    });
}

const approveDoc = async (id) => {
    return await ExtraDoc.update({
        approved: 1
    }, {
        where: {
            id: id
        }
    })
}

module.exports = {
    findAllExtraDocs,
    findExtraDocsByContentId,
    createExtraDoc,
    approveDoc
}