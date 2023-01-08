const express = require("express");
const {printSession} = require("../middlewares/index.js");
const {userIsAdmin, createUser, verifyUser, deleteUser, readAllUsers, readUser, updateUser, searchAdmin} = require("../controllers/users.js");
const {deleteThread, readAllResponses, readThread, createThread, readAllThreads, readMyThreads, getOwnerThread} = require("../controllers/threads.js");
const router = express.Router();
const axios = require("axios");
const { User } = require("../models/index.js");
const { Thread } = require("../models/index.js");
var {sess} = require('../app.js');


/**
 * Créer un administrateur
 */

if(searchAdmin())
{
    const admin = new User({identifiant: "admin", admin: true, mdp: "admin", nom: "ad", prenom: "min", age: 44});
    admin.save();
}


/**
 * Route ping
 */
router.get('/ping', printSession, function (req, res) {
    res.json({
        status: "OK",
        timestamp: (new Date()).getTime()
    });
});


/**
 * Créer un thread 
 */
router.post('/thread', async (req, res) => {
        cur_sess = req.session;

        // On crée le thread
        const threadCree = await createThread({identifiant: cur_sess.identifiant, titre: req.body[0], contenu: req.body[1]});
        // On renvoie le thread créé !
        res.json(threadCree);
})


router.post('/response/:threadId', async (req, res) => {
    cur_sess = req.session;
    var thread = await readThread(req.params.threadId)

    // On crée le thread
    const threadCree = await createThread({reponse: thread.id, identifiant: cur_sess.identifiant, contenu: req.body[0]});
    console.log(req.body[0]);
    console.log(thread.id);
    console.log(thread.identifiant);
    // On renvoie le thread créé !
    res.json(threadCree);
})

/**
 * Créer un utilisateur
 */
router.post('/user', async (req, res) => {

    // On crée l'utilisateur
    const utilisateurCree = await createUser(req.body);

    // Pour tester la session on peut dire que le dernier utilisateur créé ira dans la session
    req.session.dernierUtilisateur = utilisateurCree;

    // On renvoie l'utilisateur créé !
    res.json(utilisateurCree);
});

router.delete('/thread/:threadId', async (req, res) => {
    res.json(await deleteThread(req.params.threadId));

});

router.get('/deleteButton/:threadId', async (req, res) => {
    cur_sess = req.session;
    identifiant = cur_sess.identifiant;
    const isAdmin = await userIsAdmin(identifiant);
    const isOwner = await getOwnerThread(req.params.threadId);
    console.log(isOwner);
    if(isAdmin || isOwner === cur_sess.identifiant){
        res.json("<a><img id='delete_thread_button' onclick='deleteThread()' src='/images/delete_thread_button.png'></a>");
    }
    else {
        res.json("");
    }
});

/**
 * Vérifier un utilisateur
 */
router.post('/verifyUser', async (req, res) => {

    var msg = await verifyUser(req.body[0], req.body[1]);

    if(msg == "ok"){
        sess = req.session
        sess.identifiant = req.body[0];
        res.json(sess);
    }
    else {
        // On renvoie le msg
        res.json("identifiant ou mdp incorrect");
    }

});

/**
 * Récupère un utilisateur par rapport à son id
 */
router.get('/user/:userId', async (req, res) => {
    res.json(await readUser(req.params.userId));
});


router.get('/thread/:threadId', async (req, res) => {
    res.json(await readThread(req.params.threadId));
});



/**
 * Modifie un utilisateur par rapport à son id et le contenu de la requête
 */
router.put('/user/:userId', async (req, res) => {
    res.json(await updateUser(req.params.userId, req.body));
});

/**
 * Supprime un utilisateur par rapport à son id
 */
router.delete('/user/:userId', async (req, res) => {
    res.json(await deleteUser(req.params.userId));
});

/**
 * Récupère tous les utilisateurs
 */
router.get('/users', async (req, res) => {
    res.json(await readAllUsers());
});

router.get('/threads', async (req, res) => {
    var allThreads = await readAllThreads();
    var s = "";
    for(var i = allThreads.length - 1; i >= 0; i--){
        s += allThreads[i].identifiant + " : <a href='http://localhost:3000/thread?id=" + allThreads[i].id + "'>" + allThreads[i].titre + "</a></br>";
    }
    res.json(s);
});


router.get('/responses/:threadId', async (req, res) => {
    cur_sess = req.session;
    var allThreads = await readAllResponses(req.params.threadId);
    var s = "";

    for(var i = allThreads.length - 1; i >= 0; i--){
        s += allThreads[i].identifiant + " : " + allThreads[i].contenu + "</br>";
    }

    res.json(s);
});


router.get('/myThreads', async (req, res) => {
    cur_sess = req.session;
    var allThreads = await readMyThreads(cur_sess.identifiant);
    if(allThreads == null){
        res.json("il n'y a aucun thread.");
    }
    else {
        var s = "";
        for(i in allThreads){
            s += allThreads[i].identifiant + " : <a href='http://localhost:3000/thread?id=" + allThreads[i].id + "'>" + allThreads[i].titre + "</a></br>";
        }
        res.json(s);
    }

});



// On veut que l'user "/" requêtée avec la méthode HTTP GET nous renvoie de la donnée
// req est la requête express où on peut avoir tout un tas d'informations sur les headers, le body de la requête, les cookies ect.
// res est la réponse express qui sera utilisée pour renvoyer ce qu'on veut et en l'occurrence ici un object json grâce à l'instruction res.json
// next est une fonction du routeur Express qui, lorsqu'elle est invoquée, exécute le middleware qui succède au middleware actuel. On l'utilisera plus tard
router.get('/', function (req, res, next) {

    // If faut penser le res.json(...) comme un "return" pour retourner la réponse avec de la donnée en retour,
    // s'il n'y a pas de res.json la réponse ne pourra jamais se finir, car le code ne saura pas quoi faire pour "libérer" la réponse
    res.json({
        status: "done",
        timestamp: Date.now()
    });
});

// Route pour avoir mon prénom
router.get('/me', function (req, res, next) {
    res.json("Antonin");
});

// Route pour envoyer une chaine quelconque
router.get('/get', function (req, res, next) {
    res.json("Antonin");
})

// Route pour renvoyer un object, dans un object, dans un object, dans un object
router.post('/post', function (req, res, next) {
    res.json({
        key1: {
            key2: {
                key3: {
                    key4: "Hello"
                }
            }
        }
    });
})

// Route pour renvoyer la date en mode Jour/Mois/Année
router.put('/put', function (req, res, next) {
    const theDate = new Date();
    res.json(`${theDate.getDate()}/${theDate.getMonth()}/${theDate.getFullYear()}`)
})

// Route pour renvoyer true si le nombre actuel de milliseconds est pair et false sinon
router.delete('/delete', function (req, res, next) {
    res.json(Date.now() % 2 === 0)
})

/**
 * Renvoie ce qui se trouve dans la session
 */
router.post('/session', async (req, res) => {
    res.json(req.session);
});



/**
 * Détruis la session
 */
router.delete('/session', (req, res) => {

    // S'il n'y a pas de session, on renvoie un message
    if (req.session === undefined) {
        res.json("Il n'y a pas de session à détuire")
    }

    // Si elle est existe alors on peut la détruire
    else {
        req.session.destroy()
        res.json("La session a été détruite !");
    }
});



// Utilisé pour exporter le router comme module
module.exports = router;
