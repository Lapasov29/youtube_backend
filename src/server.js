const fileUpload = require('express-fileupload')
const express = require('express')
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 4000
const app = express()
const os = require('os')
const api = os.networkInterfaces()[Object.keys(os.networkInterfaces())[0]][1].address 


app.use('/data/profile_pictures/', express.static(path.join(__dirname, 'profile_pictures')) )
app.use('/data/videos/', express.static(path.join(__dirname, 'videos')) )

app.use(fileUpload())
app.use(cors( {origin: 'http://192.168.1.253:3000'} ))

// loading middlewares
const modelMiddleware = require('./middlewares/model.js')
const authTokenMiddleware = require('./middlewares/authToken.js')
app.use(express.json())
app.use(modelMiddleware)

// loading routes
const userRouter = require('./routes/user.js')
const authRouter = require('./routes/auth.js')
const tokenRouter = require('./routes/tokenCheck.js')
const videoRouter = require('./routes/videoRoute.js')
 

//download videos
app.get('/download/data/videos/:fileName', (req, res) => {
	res.download( path.join(__dirname, 'videos', req.params.fileName) )
})

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/checkToken', authTokenMiddleware, tokenRouter)
app.use('/videos', videoRouter)



app.listen(PORT, () => console.log(`server is running on http://${api}:${PORT}`))