const { Content } = require("../models/Content");
const { Category } = require("../models/Category");
const userController = require("./userController");
const { Op } = require("sequelize");

const findAllContents = async () => {
  return await Content.findAll({
    attributes: ["title", "description", "url", "type"],
  });
};

const findAllUnaprovedContents = async () => {
  return await Content.findAll({
    attributes: ["title", "description", "url", "type", "id"],
    where: {
      approved: 0,
    },
  });
};

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

    const result = {};

    categoriesContents.map((category) => {
      result[category.name] = category.Contents;
    });

    console.log(result);

    return result;
  } catch (error) {
    console.error("Error @ getContentGroupByCategories");
    console.error(error);
  }
};

const findContentByUserId = async (id) => {
  const user = await userController.findUserById(id);

  if (!user[0]) {
    return null;
  }

  return Content.findAll({
    where: {
      UserId: user[0].get(id),
    },
  });
};

const createContent = async (body) => {
  const newContent = await Content.create({
    title: body.title,
    description: body.description,
    url: body.url,
    type: body.type,
    UserId: body.userId,
    CategoryId: body.categoryId,
  });

  return newContent;
};

const approveContentList = async (idList) => {
  console.log(idList);
  return await Content.update(
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

module.exports = {
  findAllContents,
  findAllUnaprovedContents,
  findContentByUserId,
  createContent,
  approveContentList,
  getContentGroupByCategories,
};
