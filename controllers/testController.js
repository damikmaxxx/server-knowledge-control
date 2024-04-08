const { Test, Question, User } = require("../models/models");
const sequelize = require("../db")
const ApiError = require("../error/ApiError");
const { Course } = require("../models/models");
class TestController {
  async create(req, res, next) {
    const { name, courseId, questions } = req.body;
    if (!name || !courseId) {
      return next(ApiError.badRequest("Некоректный name или courseId"));
    }
    const existingCourse = await Course.findByPk(courseId);
    if (!existingCourse) {
      return next(ApiError.badRequest("CourseId не найден"));
    }
    const userId = req.user.id;
    const test = await Test.create({ name, userId, courseId });
    if (questions.length > 0) {
      questions.map(async (q) => {
        const question = await Question.create({
          text: q.text,
          complexity: q.complexity,
          answer: q.answer,
          testId: test.id,
          characteristicId: q.characteristicId,
        });
      });
    }
    return res.json({ test });
  }
  async delete(req, res, next) {
    const { id } = req.body;
    const userId = req.user.id;
    if (!id) {
      return next(ApiError.badRequest("Не указан идентификатор теста"));
    }

    const transaction = await sequelize.transaction();
  
    try {
      const test = await Test.findByPk(id, { transaction });
      if (!test) {
        await transaction.rollback();
        return next(ApiError.badRequest("Тест не найден"));
      }
      // Проверяем, является ли текущий пользователь создателем теста
      if (test.userId !== userId) {
        await transaction.rollback();
        return next(ApiError.forbidden("Вы не являетесь создателем этого теста"));
      }

      await Question.destroy({ where: { testId: id }, transaction });
      await test.destroy({ transaction });
  
      await transaction.commit();
  
      return res.json({ message: "Тест и связанные с ним вопросы успешно удалены" });
    } catch (error) {
      await transaction.rollback();
      return next(ApiError.internal("Ошибка при удалении теста и вопросов", error));
    }
  }
  async getAll(req, res) {
    const { courseId } = req.params;
    const tests = await Test.findAll({
      where: { courseId },
    });
    return res.json(tests);
  }
  async getQuestionsTest(req, res) {
    const { courseId, id } = req.params;
    const test = await Test.findOne({
      where: { courseId, id },
    });
    const questions = await Question.findAll({
      where: { testId: test.id },
    });
    const questionWithIndex = questions.map((q, index) => {
      return { ...q.toJSON(), index: index + 1 };
    });
    return res.json(questionWithIndex);
  }
  async getCreatorTest(req, res) {
    const { courseId, id } = req.params;
    const test = await Test.findOne({
      where: { courseId, id },
    });
    const creator = await User.findOne({
      where: { id: test.userId },
    });
    return res.json(creator.full_name);
  }
  async getInfoTest(req, res) {
    const { courseId, id } = req.params;
    const test = await Test.findOne({
      where: { courseId, id },
    });
    const creator = await User.findOne({
      where: { id: test.userId },
    });
    const course = await Course.findOne({
      where: { id: test.courseId },
    });
    return res.json({
      creator: creator.full_name,
      name: test.name,
      courseName: course.name,
    });
  }
}

module.exports = new TestController();
