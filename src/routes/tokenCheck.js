const router = require('express').Router()
const tokenController = require('../controllers/token.js')

router.route('/')
	.get(tokenController.GET)


module.exports = router