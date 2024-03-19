const { Category } = require("../models/index");
const { Op, ValidationError } = require("sequelize");

// Function to fetch all active categories
const findAllCategory = async () => {
  try {
    // Fetch all categories where active is 1
    const categories = await Category.findAll({
      where: {
        active: 1
      }
    });

    // If there are no active categories, throw an error
    if (!categories.length) {
      throw new Error("Nenhuma categoria encontrada.");
    }

    // Return the fetched categories
    return categories;
  } catch (error) {
    // If any error occurs, throw it to be handled by the caller
    throw error;
  }
};

// Function to fetch all categories to be approved
const findAllCategoryToApprove = async () => {
  try {
    // Fetch all categories where active is 0
    const categories = await Category.findAll({
      attributes: ["id", "name", "color"],
      where: {
        active: 0,
      },
    });

    // If there are no categories to be approved, throw an error
    if (!categories.length) {
      throw new Error("Nenhuma categoria para aprovar encontrada.");
    }

    // Return the fetched categories
    return categories;
  } catch (error) {
    // If any error occurs, throw it to be handled by the caller
    throw error;
  }
};

// Function to create a new category
const createCategory = async (body) => {
  try {
    // Create a new category with the provided details
    return await Category.create({
      name: body.name,
      color: body.color,
      UserId: body.userId,
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
    throw new Error("Erro ao criar categoria.");
  }
};

// Function to approve a category
const approveCategory = async (id) => {
  try {
    // Update the active status of the category with the provided id to 1
    const [affectedCount] = await Category.update(
      {
        active: 1,
      },
      {
        where: {
          id: id,
        },
      }
    );

    // If no category was updated, throw an error
    if (!affectedCount) {
      throw new Error("Nenhuma categoria encontrada para aprovar.");
    }

    // Return the number of updated categories
    return affectedCount;
  } catch (error) {
    // If any error occurs, throw it to be handled by the caller
    throw error;
  }
};

// Function to approve a list of categories
const approveCategoryList = async (ids) => {
  try {
    // Update the active status of the categories with the provided ids to 1
    const [affectedCount] = await Category.update(
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

    // If no category was updated, throw an error
    if (!affectedCount) {
      throw new Error("Nenhuma categoria encontrada para aprovar.");
    }

    // Return the number of updated categories
    return affectedCount;
  } catch (error) {
    // If any error occurs, throw it to be handled by the caller
    throw error;
  }
};

// Export the functions
module.exports = {
  findAllCategory,
  findAllCategoryToApprove,
  approveCategory,
  createCategory,
  approveCategoryList,
};