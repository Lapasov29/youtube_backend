const path = require('path')
const fs = require('fs')

// read and write to files
const model = (req, res, next) => {
	req.select = function (fileName) {
		let files = fs.readFileSync(path.join(process.cwd(), 'src', 'database', fileName + '.json'), 'UTF-8')
		files = files ? JSON.parse(files): []
		return files
	}

	req.insert = function (fileName, data) {
		console.log("users");
		let files = fs.writeFileSync(path.join(process.cwd(), 'src', 'database', fileName + '.json'), JSON.stringify(data, null, 4))
		return true
	}
	return next()
}


module.exports = model