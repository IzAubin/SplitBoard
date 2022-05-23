const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt");

function initialize(passport, getUserByUsername, getUserById){
	
	const authenticateUser = (username, password, done) => {
		const user = getUserByUsername(username)
		
		//Si aucune utilisateur a été trouvé avec le username reçu
		if(user == null)
		{
			return done(null, false, { message: "Ce nom d'utilisateur n'existe pas"})
		}
		
		//Si le mot de passe reçu est bien celui de l'utilisateur associé au username reçu
		// if(password == user.password)
    if (bcrypt.compareSync(password, user.password))
		{
			//C'est le bon mot de passe, on retourne l'utilisateur
			return done(null, user);
		}
		else
		{
			return done(null, false, { message: "Le mot de passe est invalide"})
		}
	}

	passport.use(new LocalStrategy({ usernameField:"username", passwordField:"password"},authenticateUser))
	passport.serializeUser((user, done) => done(null, user.id))
	passport.deserializeUser((id, done) => {
		return done(null, getUserById(id))
	})
}

module.exports = initialize