const Router = require('express')
const router = new Router()
const courseController = require('../controllers/courseController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
router.post('/',authMiddleware,checkRole("TEACHER"),courseController.create)
router.post('/delete',authMiddleware,checkRole("TEACHER"),courseController.delete)
router.get('/',courseController.getAll)
router.get('/:id',courseController.getOne)
module.exports = router