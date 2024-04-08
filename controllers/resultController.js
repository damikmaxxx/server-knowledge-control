const {
  Test,
  Result,
  ResultCharacteristic,
  Characteristic,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class ResultController {
  async create(req, res, next) {
    const { testId, resultsCharacteristic } = req.body;
    if (!testId || !resultsCharacteristic) {
      return next(
        ApiError.badRequest("Некоректный testId или resultsCharacteristic")
      );
    }
    const existingTest = await Test.findByPk(testId);
    if (!existingTest) {
      return next(ApiError.badRequest("testId не найден"));
    }
    const userId = req.user.id;
    const result = await Result.create({ testId, userId });
    for (let char in resultsCharacteristic) {
      console.log(resultsCharacteristic[char], resultsCharacteristic, char);
      await ResultCharacteristic.create({
        resultId: result.id,
        percentageResult: resultsCharacteristic[char],
        characteristicId: char,
      });
    }

    return res.json({ result });
  }
  async createCharacteristic(req, res, next) {
    const { points, characteristicId, resultId } = req.body;
    if (!points || !characteristicId || !resultId) {
      return next(
        ApiError.badRequest("Некоректные points,characteristicId,resultId")
      );
    }
    const existingTest = await Characteristic.findByPk(characteristicId);
    if (!existingTest) {
      return next(ApiError.badRequest("characteristicId не найден"));
    }
    const existingResult = await Result.findByPk(resultId);
    if (!existingResult) {
      return next(ApiError.badRequest("resultId не найден"));
    }
    const result = await ResultCharacteristic.create({
      points,
      characteristicId,
      resultId,
    });
    return res.json({ result });
  }

  async check(req, res, next) {
    const userId = req.user.id;
    const existingResult = await Result.findAll({
      where: {
        userId,
      },
    });
    const results = await Promise.all(existingResult.map(async (result) => {
      const characteristics = await ResultCharacteristic.findAll({
        where: {
          resultId: result.id,
        },
      });
      return { resultId:result.testId,characteristics };
    }));

    return res.json(results);
  }
}

module.exports = new ResultController();
