const router = require('express').Router()
const videoController = require('../controllers/videoCont.js')
const authTokenMiddleware = require('../middlewares/authToken.js')


// videos route
router.route('/')
	.get(videoController.GET)
    .post(authTokenMiddleware, videoController.POST)
    .put(authTokenMiddleware, videoController.PUT)
    .delete(authTokenMiddleware, videoController.DELETE)

router.route('/?')
	.get(videoController.GET)
    // .post(authTokenMiddleware, videoController.POST)


module.exports = router