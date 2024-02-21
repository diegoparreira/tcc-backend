const { Content, Category } = require("../models/index");
const { Op, ValidationError } = require("sequelize");
const userController = require("./userController");

// Fetch single content by id
const getContentById = async (id) => {
  try {
    const content = await Content.findByPk(id);

    return content;
  } catch (error) {
    throw error;
  }
};

// Fetch all contents
const getAllContents = async () => {
  try {
    const contents = await Content.findAll({
      attributes: ["title", "description", "url", "type"],
    });

    // If ther no contents, throw an error
    if (!contents.length) {
      throw new Error("Nenhum conteúdo encontrado.");
    }

    return contents;
  } catch (error) {
    throw error;
  }
};

// Fetch all unaproved contents
const getAllUnaprovedContents = async () => {
  try {
    const contents = await Content.findAll({
      attributes: ["title", "description", "url", "type", "id"],
      where: {
        approved: 0,
      },
    });

    // If there are no unaproved contents, throw an error
    if (!contents.length) {
      throw new Error("Nenhum conteúdo não aprovado encontrado.");
    }

    return contents;
  } catch (error) {
    // Propagate the error to be handled by the route
    throw error;
  }
};

// Fetch contents grouped by categories
const getContentGroupByCategories = async () => {
  try {
    const categoriesContents = await Category.findAll({
      include: {
        model: Content,
        where: {
          approved: 1
        }
      },
    });

    return result = categoriesContents.reduce((acc, category) => {
      acc[category.name] = category.Contents;
      return acc;
    }, {});
  } catch (error) {
    throw error;
  }
};

const getContentByUserId = async (id) => {
  try {
    const user = await userController.findUserById(id);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const contents = await Content.findAll({
      where: {
        UserId: user.id,
      },
    });

    if (!contents.length) {
      throw new Error("Nenhum conteúdo encontrado para este usuário.");
    }

    return contents;
  } catch (error) {
    throw error;
  }
};

const createContent = async (body) => {
  try {
    const newContent = await Content.create({
      title: body.title,
      description: body.description,
      url: body.url,
      type: body.type,
      UserId: body.userId,
      CategoryId: body.categoryId,
    });

    return newContent;
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => ({
        message: err.message,
        type: err.type,
        path: err.path,
      }));

      throw new Error(JSON.stringify(errors));
    }

    throw new Error("Erro ao criar conteúdo.");
  }
};

const approveContentList = async (idList) => {
  try {
    const [affectedCount] = await Content.update(
      {
        approved: 1,
      },
      {
        where: {
          id: {
            [Op.in]: idList,
          },
          approved: 0,
        },
      }
    );

    return affectedCount;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getContentById,
  getAllContents,
  getAllUnaprovedContents,
  getContentGroupByCategories,
  getContentByUserId,
  createContent,
  approveContentList,
};