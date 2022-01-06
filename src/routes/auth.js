const router = require('express').Router()
const authController = require('../controllers/auth.js')
const validator = require('../middlewares/validator.js')

// authorization routes
router.post('/login', validator.loginValidator, authController.LOGIN)
router.post('/register', validator.registerValidator, authController.REGISTER)




module.exports = router