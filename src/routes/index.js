let express = require("express");
let passport = require("passport");
let router = express.Router();

const indexController = require("../controllers/index_controller.js");
const equipementController = require("../controllers/equipement_controller.js");
const infolettreController = require("../controllers/infolettre_controller.js");
const instructionController = require("../controllers/instruction_controller.js");
const aProposController = require("../controllers/aPropos_controller.js");
const appController = require("../controllers/app_controller.js");

// DEBUT
// let ExpressBrute = require('express-brute'),
//     MemcachedStore = require('express-brute-memcached'),
//     moment = require('moment'),
//     store;

// store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production

//  let failCallback = function (req, res, next, nextValidRequestDate) {
//    console.log("dans failcallback please try again "+moment(nextValidRequestDate).fromNow());
//    req.flash("error", "too many");
//  }

//  let globalBrute = new ExpressBrute(store, {
//    freeRetries: 2,
//    failCallback: failCallback,
//    FailTooManyRquests: 2
//   }
//   );
// FIN
const ExpressBrute = require("express-brute");

//Initialise la mémoire local d'ExpressBrute
//ExpressBrute limite le nombre de tentatives de connexion. Après après avoir épuisé le nombre de tentatives une première fois, il y a un délai minimum à attente (minWait). Par la suite, si le nombre de tentatives est encore un échec, ce délai augmente à chaque fois jusqu'à un délai maximum (maxWait) avec une séquence de type Fibonacci.
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

//Fonction appelé lorsque trop de tentatives de connexion a été intercepté par ExpressBrute
var bruteForceFailCallback = function (req, res, next) {
  // brute force protection triggered, send them back to the login page
  console.log(
    "You've made too many failed attempts in a short period of time, please try again"
  );
  req.flash(
    "error",
    "Vous avez tenté de vous connecter trop de fois. Veuillez réessayer plus tard."
  );
  res.redirect("/login");
};

//Configurations des options de ExpressBrute
var userBruteforce = new ExpressBrute(store, {
  freeRetries: 2, //Nombre de tentative supplémentaire (0 = une 2e tentative sera impossible, 2 = une 4e tentative sera impossible)
  minWait: 5 * 60 * 1000, // 5 minutes, c'est le délai minimal autorisé entre chaque tentative après avoir épuisé les essaies
  maxWait: 60 * 60 * 1000, // 1 heure,
  failCallback: bruteForceFailCallback,
});

router.get("/", indexController.getIndex);
router.get("/login", appController.getAppLogin);
router.get("/accueil", appController.getAppForm);
router.get("/register", appController.getAppRegister);
router.get("/logout", appController.getAppLogout);

// **** Méthodes POST ****

//Route de la page qui reçoit les informations de formulaires
router.post(
  "/authenticate",
  userBruteforce.getMiddleware({
    key: function (req, res, next) {
      //Valide si l'utilisateur a tenté de se connecter trop de fois

      //Il faut appeler next(), en utilisant comme paramètre le nom d'utilisateur à valider
      // Ici, le nom de l'utilisateur (username) est accessible dans le body de la requête (req.body.username)

      next(req.body.username);
    },
  }),

  function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (info != null && info.message != null) {
        //Si il y a un message Flash a retourné, on le flash
        req.flash("error", info.message);
      }

      if (err) {
        console.log("Error Passport:", err);
        return next(err);
      }

      if (!user) {
        //Si l'utilisateur n'existe pas
        return res.redirect("/login");
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        //La connexion de l'utilisateur est un succès

        // réinitialise le compteur de tentative pour ExpressBrute
        req.brute.reset(function () {
          return res.redirect("/planifier");
        });
      });
    })(req, res, next);
  },
  appController.checkNotAuthenticated,
  appController.postAppAuthenticate
);

// router.post(
//   "/authenticate",  globalBrute.prevent,
//   appController.checkNotAuthenticated,
//   appController.postAppAuthenticate
// );

router.post(
  "/register",
  appController.checkNotAuthenticated,
  appController.postAppRegister
);

router.get("/planifier", isLoggedIn, instructionController.getPlanifier);
router.get("/equipement", equipementController.getEquipement);
router.get("/accessoires", equipementController.getAccessoire);
router.get("/commentcafonctionne", equipementController.commentCaFonctionne);
router.get("/infolettre", infolettreController.getInfolettre);
router.get("/instructions", instructionController.getInstructions);
router.get("/aPropos", aProposController.getAPropos);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
