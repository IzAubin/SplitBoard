/*jshint esversion: 6 */
/**
 * Exemple d'un formulaire de connexion à utiliser pour le TP#2 du cours de sécurité informatique 420-303-AH
 *
 * @author Patrice Robitaille <patrice.robitaille@cstjean.qc.ca>
 *
 * @requires express
 * @requires express-session
 * @requires express-flash
 * @requires passport
 * @requires passport-local
 * @requires pug
 *
 * @tutorial Ce code est inspiré d'un tutoriel vidéo disponible ici: https://youtu.be/-RCnNyD0L-s
 */

const express = require("express");
const app = express();
const route = require("./src/routes/index.js"); // MIQSplitboard
//Passport permet d'authentifier les requêtes
const passport = require("passport");
//Flash Permet de retourner un message à la page sans faire une redirection de requête
const flash = require("express-flash");
//Permet de créer une session utilisateur
const session = require("express-session");

//Numéro de port de l'application
const port = 3020;

//Importe le fichier passport-config.js
const initializePassport = require("./src/middleware/passport-config");
initializePassport(
  passport,
  (username) => users.find((user) => user.username === username),
  (id) => users.find((user) => user.id === id)
);

//Variable qui permet de stocker les informations des utilisateurs sans avoir à utiliser une base de données
users = [];

//Ajoute à la variable users un utilisateur ayant un nom d'utilisateure et un mot de passe
// TODO: Ne serait-il pas mieux d'avoir un mot de passe haché ici? Certainement! BCrypt peut-être utile.
users.push({
  id: Date.now(),
  username: "user_1234",
  password: "mot_de_passe_pas_securitaire",
});

//MIDDLEWARES
app.set("view engine", "pug");
app.use(express.static("public")); // MIQSplitboard

//The extended option allows to parse the URL-encoded data with the querystring library (when false)
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: "fkladjsf9ads08f7391r48fhjeoqr3;fnvhv134789fy3o149hfr34",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// route.initialize(passport);
// route.allo();
app.use(route); // MIQSplitboard

//Démarre l'application sur le port 3000 (localhost:3000)
var server = app.listen(port, () => {
  let port = server.address().port;
  let host = server.address().address;
  console.log("We are live on " + port + " " + host);
});
