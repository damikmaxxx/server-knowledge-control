const { Course, Test, Question } = require("../models/models");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const sequelize = require("../db");
class CourseController {
  async create(req, res, next) {
    console.log("----------------------------------",req.files);
    console.log(req.body.img);
    let { name} = req.body;
    let fileName;
    console.log(!req.files || !req.files.img)
    if (!req.files || !req.files.img) {
      fileName = null
    } else {
      let img = req.files.img;
      fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
    }

    if (!name) {
      return next(ApiError.badRequest("Некорректный name"));
    }
    const userId = req.user.id;
    console.log("_-------------------------1")
    const course = await Course.create({ name, userId,img:fileName});
    console.log("_-------------------------2")
    return res.json({ course });
  }
  async delete(req, res, next) {
    const { id } = req.body;
    const userId = req.user.id;

    if (!id) {
      return next(ApiError.badRequest("Не указан идентификатор курса"));
    }

    const transaction = await sequelize.transaction();

    try {
      const course = await Course.findByPk(id, { transaction });
      if (!course) {
        await transaction.rollback();
        return next(ApiError.badRequest("Курс не найден"));
      }

      // Проверяем, является ли текущий пользователь создателем курса
      if (course.userId !== userId) {
        await transaction.rollback();
        return next(
          ApiError.forbidden("Вы не являетесь создателем этого курса")
        );
      }

      // Находим все тесты, относящиеся к этому курсу
      const tests = await Test.findAll({
        where: { courseId: id },
        transaction,
      });

      // Удаляем все вопросы, относящиеся к этим тестам
      for (const test of tests) {
        console.log("-----------------------", test.id);
        await Question.destroy({ where: { testId: test.id }, transaction });
      }

      // Удаляем все тесты, относящиеся к этому курсу
      await Test.destroy({ where: { courseId: id }, transaction });

      // Удаляем курс
      await course.destroy({ transaction });

      // Фиксируем транзакцию
      await transaction.commit();

      return res.json({
        message: "Курс и связанные с ним тесты и вопросы успешно удалены",
      });
    } catch (error) {
      await transaction.rollback();
      return next(
        ApiError.internal("Ошибка при удалении курса, тестов и вопросов", error)
      );
    }
  }
  async getAll(req, res) {
    const courses = await Course.findAll();
    return res.json(courses);
  }
  async getOne(req, res) {
    const { id } = req.params;
    console.log(id);
    const course = await Course.findOne({
      where: { id },
    });
    return res.json(course);
  }
}

module.exports = new CourseController();
