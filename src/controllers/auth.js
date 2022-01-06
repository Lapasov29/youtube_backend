const sha256 = require('sha256')
const jwt = require('jsonwebtoken')
const path = require('path')

// logger
const LOGIN = (req, res) => {
	const { username, password } = req.body
	const users = req.select('users')

	let user = users.find( user => user.username === username && user.password === sha256(password) )
	if(!user) {
		res.status(400).json({ message: "Wrong username or password!" })
	}

	res.status(200).json({
		userId: user.userId,
		message: "The user successfully logged in!",
		token: jwt.sign({ userId: user.userId, agent: req['headers']['user-agent'] }, 'SECRET_KEY')
	})
}

// registering user
const REGISTER = (req, res) => {
	try {
		const { username, password } = req.body
		const { file } = req.files
		const users = req.select('users')

		if(file.name.split('.')[1] !== 'png' && file.name.split('.')[1] !== 'jpg'){
			throw new Error("Invalid image type!")
		}

		users.forEach(user => {
			if(user.username === username){
				throw new Error("This username has been taken!")
			}
		});

		let userId = users.length ? users[users.length - 1].userId + 1 : 1

		

		const imageName = userId + file.name.replace(/\s/g, '')

		file.mv( path.join(process.cwd(), 'src', 'profile_pictures', imageName) )

		let newUser = {
			userId,
			username,
			password: sha256(password),
			imageUrl: "/data/profile_pictures/" + imageName
		} 
		users.push(newUser)
		req.insert('users', users)

		res.status(201).json({
			userId: newUser.userId,
			message: "The user successfully registered!",
			token: jwt.sign({ userId: newUser.userId, agent: req['headers']['user-agent'] }, 'SECRET_KEY')
		})

	} catch(error) {
		res.status(404).json({ message: error.message })
	}
}


module.exports = {
	REGISTER,
	LOGIN
}