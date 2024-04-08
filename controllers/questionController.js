const {Question,Test,Characteristic} = require("../models/models")
const ApiError = require('../error/ApiError');

class QuestionController{
    async create(req,res,next){
        const {text,complexity,answer,testId,characteristicId} = req.body
        if (!text || !complexity || !answer || !testId || !characteristicId) {
            return next(ApiError.badRequest("Некоректный данные (text,complexity,answer,testId,characteristicId)"));
        }
        const test = await Test.findByPk(testId);
        if (!test) {
            return next(ApiError.badRequest(`Тест с id ${testId} не найден`));
        }
        const characteristic = await Characteristic.findByPk(characteristicId);
        if (!characteristic) {
            return next(ApiError.badRequest(`Характеристика с id ${characteristicId} не найдена`));
        }
        const userId = req.user.id;
        const type = await Question.create({text,complexity,answer,testId,characteristicId})
        return res.json({type})
    }
}

module.exports = new QuestionController()