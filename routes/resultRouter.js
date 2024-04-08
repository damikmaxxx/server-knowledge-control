const Router = require('express')
const router = new Router()
const resultController = require('../controllers/resultController')
const authMiddleware = require('../middleware/authMiddleware')
router.post('/',authMiddleware,resultController.create)
router.post('/characteristic',authMiddleware,resultController.createCharacteristic)
router.get('/check',authMiddleware,resultController.check)
module.exports = router