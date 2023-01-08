const express = require("express");

// On crée le router des vues
const viewsRouter = express.Router();

// On veut que lorsque l'utilisateur aille sur http://localhost:3000 le serveur lui renvoie la vue hello.ejs dans le dossier views
viewsRouter.get('/', function (req, res) {
    res.render('connexion.ejs');
});

viewsRouter.get('/inscription', function (req, res) {
    res.render('inscription.ejs');
});

viewsRouter.get('/connexion', function (req, res) {
    res.render('connexion.ejs');
});

viewsRouter.get('/accueil', function (req, res) {
    res.render('accueil.ejs');
});

viewsRouter.get('/nouveauThread', function (req, res) {
    res.render('nouveauThread.ejs');
});

viewsRouter.get('/profil', function (req, res) {
    res.render('profil.ejs');
});

viewsRouter.get('/thread', function (req, res) {
    res.render('thread.ejs');
});

// On exporte seulement le router
module.exports = viewsRouter;