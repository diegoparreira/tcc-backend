const { Category } = require("../models/Category");
const { Op } = require("sequelize");

const findAllCategory = async () => {
  return await Category.findAll({
    where: {
      active: 1
    }
  });
};

const findAllCategoryToApprove = async () => {
  return await Category.findAll({
    attributes: ["id", "name", "color"],
    where: {
      active: 0,
    },
  });
};

const createCategory = async (body) => {
  const newCategory = await Category.create({
    name: body.name,
    color: body.color,
    UserId: body.userId,
  });

  return newCategory;
};

const approveCategory = async (id) => {
  return await Category.update(
    {
      active: 1,
    },
    {
      where: {
        id: id,
      },
    }
  );
};

const approveCategoryList = async (ids) => {
  return await Category.update(
    {
      active: 1,
    },
    {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    }
  );
};

module.exports = {
  findAllCategory,
  findAllCategoryToApprove,
  approveCategoryList,
  createCategory,
  approveCategory,
};
