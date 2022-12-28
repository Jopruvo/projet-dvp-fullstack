const express = require("express");

// On crée le router des vues
const viewsRouter = express.Router();

// On veut que lorsque l'utilisateur aille sur http://localhost:3000 le serveur lui renvoie la vue hello.ejs dans le dossier views
//viewsRouter.get('/', function (req, res) {
//    res.render('hello');
//});


// On veut que lorsque l'utilisateur aille sur http://localhost:3000/withdata le serveur lui renvoie la vue helloWithData.ejs dans le dossier views AVEC de la donnée
viewsRouter.get('/withdata', function (req, res) {

    // On rend la vue avec l'object {data: {var1: 1, var2: "World"}} comme donnée
    res.render('helloWithData', {data: {var1: 1, var2: "World"}});
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/rest le serveur lui renvoie la vue testAPIREST.ejs.ejs dans le dossier views
viewsRouter.get('/rest', function (req, res) {
    res.render('testAPIREST.ejs');
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

// On exporte seulement le router
module.exports = viewsRouter;