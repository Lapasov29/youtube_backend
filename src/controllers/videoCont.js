const path = require('path')
const fs = require('fs')

const GET = (req, res) => {
	const videos = req.select('videos')
    // get videos by query
    if(req.query){
        if(req.query.userId){
            let info = videos.filter(z => z.userId == req.query.userId)
            res.json(info)
        }else if(req.query.title && req.query.title != ''){
            let info = videos.filter(z => z.videoTitle.includes(req.query.title.toLowerCase()))
            res.json(info)
        }
    }else res.json( videos )
}

// saving uploaded videos 
const POST = (req, res) => {
	try {
		let { title, date, time } = req.body
		const { file } = req.files
		const videos = req.select('videos')

        let size = ((file.size / 1000000) + '').split('.')[0]

		if(file.name.split('.')[1] !== 'mp4'){
			throw new Error("Invalid video format!")
		}
        if(size > 200){
            throw new Error("Video size does not match!")
        }
		let videoId = videos.length ? videos[videos.length - 1].videoId + 1 : 1

        title = title.replace(/\s/g, '_')
		file.mv( path.join(process.cwd(), 'src', 'videos', videoId + title + '.mp4') )

		let newVideo = {
			userId: req.userId,
			videoId,
            videoUrl: "data/videos/" + videoId + title + '.mp4',
			videoTitle: title,
            uploadedDate: date,
            uploadedTime: time,
            size
		} 
		videos.push(newVideo)
		req.insert('videos', videos)

		res.status(201).json({
			message: "The video successfully added!",
		})

	} catch(error) {
		res.status(404).json({ message: error.message })
	}
}

// updating video information
const PUT = (req, res) => {
    try {
        let videos = req.select('videos')
        let {videoId, videoTitle} = req.body
        if(!videoId){
            throw new Error("VideoId must be provided")
        }
        if(videoTitle.length == 0){
            throw new Error("Invalid input!")
        }
        videos.map( v => {
            if(v.videoId == videoId){
                v.videoTitle = videoTitle
            }
        })
        req.insert('videos', videos)

        res.status(201).json({
            message: "The video title successfully edited!",
            status: 201
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// deleting videos
const DELETE = (req,res) => {
    try {
        let videos = req.select('videos')
        let {videoId} = req.body
        if(!videoId){
            throw new Error("VideoId must be provided")
        }

        let find = videos.find(v => v.videoId == videoId)

        if(find){
            let change = videos.splice(videos.findIndex(v => v.videoId == videoId), 1)
            fs.unlinkSync(path.join(process.cwd(), 'src', 'videos', change[0].videoId + change[0].videoTitle + '.mp4'))
            req.insert('videos', videos)

            res.status(201).json({
                message: "The video title successfully deleted!",
                status: 201
            })
        }
        
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

module.exports = {
	GET,
    POST,
    PUT,
    DELETE
}
