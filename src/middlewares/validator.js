// validate registration input
const registerValidator = (req, res, next) => {
	try {
		const { username, password } = req.body

		if(!username) throw new Error("username is required!")
		if(!password) throw new Error("password is required!")

		if(typeof(username) !== 'string' || username.length < 1 || username.length > 50) {
			throw new Error("Invalid username!")
		}

		if (
			password.length < 5 || 
			password.length > 16 ||
			!(/[A-Za-z]/).test(password) ||
			!(/[0-9]/).test(password)
		) {
			throw new Error("Invalid password!")
		}

		return next()
		
	} catch(error) {
		res.status(400).json({ message: error.message })
	}
}

// validate login input
const loginValidator = (req, res, next) => {
	try {
		const { username, password } = req.body

		if(!username) throw new Error("username is required!")
		if(!password) throw new Error("password is required!")

		return next()
	} catch(error) {
		res.status(400).json({ message: error.message })
	}
}


module.exports = {
	registerValidator,
	loginValidator,
}