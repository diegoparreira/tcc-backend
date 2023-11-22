const { Comment } = require("../models/Comment");
const { User } = require("../models/User");
const { Answer } = require("../models/Answer");
const { Op } = require("sequelize");

// All unaproved comments
const findAllCommentsUnaproved = async () => {
  return await Comment.findAll({
    where: {
      approved: 0,
    },
    order: [["updatedAt", "DESC"]],
  });
};

const approveCommentList = async (idList) => {
  console.log(idList);
  return await Comment.update(
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

// All aproved comments
const findAllCommentsForContent = async (contentId) => {
  return await Comment.findAll({
    where: {
      ContentId: contentId,
      approved: 1,
    },
    include: [
      { model: User },
      {
        model: Answer,
        include: [User],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
};

const createComment = async (body) => {
  return await Comment.create({
    content: body.content,
    UserId: body.userId,
    ContentId: body.contentId,
  });
};

const removeComment = async (id) => {
  return await Comment.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  findAllCommentsUnaproved,
  findAllCommentsForContent,
  approveCommentList,
  createComment,
  removeComment,
};
