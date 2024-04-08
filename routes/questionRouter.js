const Router = require('express')
const router = new Router()
const questionController = require('../controllers/questionController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
router.post('/',authMiddleware,checkRole("TEACHER"),questionController.create)
module.exports = router