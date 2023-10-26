const { Answer } = require('../models/Answer');

const findAllAnswersForComment = async (commentId) => {
    return await Answer.findAll({
        where: {
            CommentId: commentId
        },
        order: [['updatedAt', 'DESC']]
    });
}

const createAnswer = async (body) => {
    return await Answer.create({
        content: body.content,
        UserId: body.userId,
        CommentId: body.commentId
    });
}

const removeAnswer = async (id) => {
    return await Answer.destroy({
        where: {
            id: id
        }
    })
}

module.exports = {
    findAllAnswersForComment,
    createAnswer,
    removeAnswer
}