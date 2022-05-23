var passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 12;
// **** Définitions des routes ****

// **** Méthodes GET ****
// const users = [];
//Route de la page d'accueil
exports.getAppLogin = (req, res) => {
  res.render("login");
};
//Route de la page du formulaire de connexion
exports.getAppForm = (req, res) => {
  res.render("accueil", {});
};
//Route de la page du formulaire pour créer un compte
exports.getAppRegister = (req, res) => {
  res.render("register", {});
};
//Route de la page administrateur, seulement disponible si l'utilisateur est authentifié
exports.getAppAdmin = (req, res) => {
  res.render("admin", {
    username: req.user.username,
  });
};
//Route qui permet d'effectuer la déconnexion de l'utilisateur
exports.getAppLogout = (req, res) => {
  req.logOut();
  res.redirect("/login");
};

// **** Méthodes POST ****

//Route de la page qui reçoit les informations de formulaires
exports.postAppAuthenticate = passport.authenticate("local", {
  successRedirect: "/planifier",
  failureRedirect: "/login",
  failureFlash: true,
});

exports.postAppRegister = (req, res) => {
  const maVar = hashPassword(req.body.password);
  console.log("maVar: " + maVar);
  users.push({
    id: Date.now().toString(),
    username: req.body.username,
    password: maVar,
  });

  res.redirect("/");
  console.log(users);
};

function hashPassword(password) {
  let salt = bcrypt.genSaltSync(saltRounds);
  let hashedPassword = bcrypt.hashSync(password, salt);
  // console.log("salt: " + salt);
  // console.log("hashed + salt: " + hashedPassword);
  return hashedPassword;
}

//Vérifie si l'utilisateur est authentifié, sinon redirige à la page de connexion
exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

//Vérifie si l'utilisateur n'est pas authentifié, sinon, redirige à la page admin
exports.checkNotAuthenticated = (req, res, next) => {
  console.log("dans checkNotAuthenticated");
  if (req.isAuthenticated()) {
    console.log(" sous IF isAuthenticated()");
    return res.redirect("/planifier");
  }
  next();
};
