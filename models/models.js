const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.STRING,},
  email: { type: DataTypes.STRING, unique:true},
  password:{type:DataTypes.STRING,},
  role: {type:DataTypes.STRING,defaultValue:"STUDENT"},
});

const Course = sequelize.define("course", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING,},
    img: {type: DataTypes.STRING},
});
  
const Test = sequelize.define("test", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING,},
});

const Question = sequelize.define("question", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING,},
    complexity: { type: DataTypes.INTEGER},
    answer:{ type: DataTypes.STRING,},
});

const Characteristic = sequelize.define("characteristic", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING,},
});

const Result = sequelize.define("result", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const ResultCharacteristic = sequelize.define("resultCharacteristic", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    percentageResult: { type: DataTypes.INTEGER, },
});


User.hasMany(Course)
Course.belongsTo(User)

User.hasMany(Test)
Test.belongsTo(User)

Course.hasMany(Test)
Test.belongsTo(Course)

Test.hasMany(Result)
Result.belongsTo(Test)

User.hasMany(Result)
Result.belongsTo(User)

Test.hasMany(Question)
Question.belongsTo(Test)

Characteristic.hasMany(Question)
Question.belongsTo(Characteristic)

Characteristic.hasMany(ResultCharacteristic)
ResultCharacteristic.belongsTo(Characteristic)

Result.hasMany(ResultCharacteristic)
ResultCharacteristic.belongsTo(Result)

module.exports = {
    User,
    Course,
    Test,
    Question,
    Characteristic,
    Result,
    ResultCharacteristic,
}