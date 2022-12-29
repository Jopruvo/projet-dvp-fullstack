const express = require("express");
const {printSession} = require("../middlewares/index.js");
const {createUser, verifyUser, deleteUser, readAllUsers, readUser, updateUser} = require("../controllers/users.js");
const router = express.Router();
const axios = require("axios");

// Cette forme d'import permet d'importer plusieurs éléments en même temps du fichier middlewares
const {printAnatomy, hello} = require("../middlewares");


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

/**
 * Vérifier un utilisateur
 */
router.post('/verifyUser', async (req, res) => {

    // On crée l'utilisateur
    const msg = await verifyUser(req.body[0], req.body[1]);

    if(msg == "ok"){
        req.session.identifiant = req.body[0];
        req.session.save();
    }

    // On renvoie l'utilisateur créé !
    res.json(msg);
});

/**
 * Récupère un utilisateur par rapport à son id
 */
router.get('/user/:userId', async (req, res) => {
    res.json(await readUser(req.params.userId));
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

// Le paramètre ou slug peut avoir à peu près n'importe quel nom
// et doit être forcement précédé de ': puis une chaine de caractère sans espaces
router.get('/etudiant/:numEtu', function (req, res, next) {
    // Pour accèder au paramètre on peut le retrouver directement dans les
    // paramètres de la requête
    res.json(`Le numéro étudiant est récupéré et est: ${req.params.numEtu}`);
});

// On veut renvoyer une chaine de caractère avec de la donnée envoyée dans le body de la requête POST
router.post('/etudiant', function (req, res, next) {

    /*
    Pour accèder à de la donnée JSON à l'intérieur du body de la requête on peut tout simplement récupérer
    req.body qui est en fait un object JSON avec ce qu'on lui a donné lors de la requête (si on ne lui donne
    rien alors il sera juste vide: {})
    */
    res.json(`L'étudiant ${req.body.nameEtu} avec le numéro étudiant ${req.body.numEtu} a été crée !`)
});

/*
Ici je veux appeler les 4 users quand je veux accéder à l'user "/api/all"
 */
router.post('/all', async function (req, res, next) {
    try {
        // On fait l'appel à notre propre API avec axios pour les 4 users
        // Pour rappel mon body ressemble à ça:
        /*
        {
            get: "Hello",
            post: {
                "hello": "test",
                "bye": "no"
            },
            putParam: 1234567890000,
            putBody: 1234567890,
            delete: "1234"
        }
         */

        // Pour la requête get on met la valeur de "req.body.get" dans l'URL comme paramètre
        const responseGet = await axios.get(`http://localhost:3000/v2/api/get/${req.body.get}`);

        // Pour la requête post on lui donne comme valeur de body, l'object qui se trouve dans "req.body.post"
        const responsePost = await axios.post(`http://localhost:3000/v2/api/post`, req.body.post);

        // Pour la requête put on donne un paramètre et un object dans le body
        const responsePut = await axios.put(`http://localhost:3000/v2/api/put/${req.body.putParam}`, {timestamp: req.body.putBody});

        // Pour la requête delete on donne juste un paramètre
        const responseDelete = await axios.delete(`http://localhost:3000/v2/api/delete/${req.body.delete}`);

        // On peut voir qu'on a attendue que chaque requête soit faite les unes à la suite des autres grâce au mot clef await car axios.get,post,put,delete renvoie
        // Une promesse qui a besoin d'être attendue.

        // On renvoie l'object avec les données une fois qu'on a attendue les 4 requêtes, attention les réponses renvoyées par axios sont des objects réponse et comme
        // il nous faut que la donnée renvoyée on veut cette donnée qui se trouve à la clef data de la réponse !
        res.json({
            get: responseGet.data,
            post: responsePost.data,
            put: responsePut.data,
            delete: responseDelete.data,
        })
    }

        // S'il y a une erreur alors on la renvoie avec du texte
    catch (error) {
        res.json(`Il y a eu des erreurs !!!\n${error.message}`);
    }
});


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
