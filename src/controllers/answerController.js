const { Answer } = require('../models/Answer');
const { Op } = require("sequelize");

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

const findAllAnswersUnaproved = async () => {
    return await Answer.findAll({
      where: {
        approved: 0,
      },
      order: [["updatedAt", "DESC"]],
    });
  };

const approveAnswerList = async (idList) => {
    console.log(idList);
    return await Answer.update(
      {
        approved: 1,
      },
      {
        where: {
          id: {
            [Op.in]: idList,
          },
        },
      }
    );
  };

const removeAnswer = async (id) => {
    return await Answer.destroy({
        where: {
            id: id
        }
    })
}

module.exports = {
    findAllAnswersForComment,
    approveAnswerList,
    findAllAnswersUnaproved,
    createAnswer,
    removeAnswer
}