const { Answer } = require("../models/index");
const { Op, ValidationError } = require("sequelize");

// Fetch all answers for a given comment
const findAllAnswersForComment = async (commentId) => {
  try {
    const answers = await Answer.findAll({
      where: {
        CommentId: commentId,
      },
      order: [["updatedAt", "DESC"]],
    });

    // If there are no answers, throw an error
    if (!answers.length) {
      throw new Error("Nenhuma resposta encontrada para este comentário.");
    }

    return answers;
  } catch (error) {
    // Propagate the error to be handled by the route
    throw error;
  }
};

// Create a new answer
const createAnswer = async (body) => {
  try {
    return await Answer.create({
      content: body.content,
      UserId: body.userId,
      CommentId: body.commentId,
    });
  } catch (error) {
    // If the error is a validation error, map the errors and throw a new error
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => ({
        message: err.message,
        type: err.type,
        path: err.path,
      }));

      throw new Error(JSON.stringify(errors));
    }

    // For other types of errors, throw a generic error
    throw new Error("Erro ao criar resposta.");
  }
};

// Fetch all unapproved answers
const findAllUnapprovedAnswers = async () => {
  try {
    const answers = await Answer.findAll({
      where: {
        approved: 0,
      },
      order: [["updatedAt", "DESC"]],
    });

    // If there are no unapproved answers, throw an error
    if (!answers.length) {
      throw new Error("Nenhuma resposta não aprovada encontrada.");
    }

    return answers;
  } catch (error) {
    // Propagate the error to be handled by the route
    throw error;
  }
};

// Approve a list of answers
const approveAnswerList = async (idList) => {
  try {
    const [affectedCount] = await Answer.update(
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

    // If no answers were affected, throw an error
    if (!affectedCount) {
      throw new Error("Nenhuma resposta encontrada para aprovar.");
    }

    return affectedCount;
  } catch (error) {
    // Propagate the error to be handled by the route
    throw error;
  }
};

// Remove an answer
const removeAnswer = async (id) => {
  try {
    const affectedCount = await Answer.destroy({
      where: {
        id: id,
      },
    });

    // If no answers were affected, throw an error
    if (!affectedCount) {
      throw new Error("Nenhuma resposta encontrada para remover.");
    }

    return affectedCount;
  } catch (error) {
    // Propagate the error to be handled by the route
    throw error;
  }
};

module.exports = {
  findAllAnswersForComment,
  approveAnswerList,
  findAllUnapprovedAnswers,
  createAnswer,
  removeAnswer,
};
