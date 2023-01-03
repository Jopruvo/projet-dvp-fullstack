const {getKeysNotProvided, isObjectIdStringValid} = require("../utils.js");
const {Thread} = require("../models/index.js");
const { object } = require("webidl-conversions");
const { default: axios } = require("axios");


/**
 * Créer un utilisateur
 * @param user L'utilisateur à créer
 * @returns L'utilisateur crée
 */
async function createThread(thread) {

    // On regarde déjà si tous les champs de l'utilisateur sont présents
    const neededKeys = ["identifiant", "contenu"];
    const keysNotGiven = getKeysNotProvided(neededKeys, thread);

    // Si une ou plusieurs clefs ne sont pas données alors on renvoie un message d'erreur
    if (keysNotGiven.length !== 0) {
        return `Remplissez toutes les informations`;
    }

    console.log("ok");

    // On peut essayer de créer le thread
    try {

        // On crée un thread avec le model de MongoDB et les informations du thread
        const threadToCreate = new Thread(thread);
        
        // Puis on le sauvegarde en n'oubliant pas le mot clef await qui va nous permettre d'attendre que le thread
        // soit sauvegarder pour nous le renvoyer
        return await threadToCreate.save();
    }

        // S'il y a une erreur lors du processus alors on renvoie un message d'erreur
    catch (e) {
        throw e; //"Une erreur s'est produite lors de la création de votre thread";
    }



    
}


async function readAllThreads() {

    // On essaye de récupérer TOUS les threads (donc on ne met pas de conditions lors de la recherche, juste un object vide)
    try {
        return await Thread.find({reponse: undefined})
    }

        // S'il y a une erreur, on renvoie un message
    catch (e) {
        return "Il y a eu une erreur lors de la recuperation des posts";
    }
}

async function readAllResponses(threadId){
    try {
        return await Thread.find({reponse: threadId})
    }

        // S'il y a une erreur, on renvoie un message
    catch (e) {
        return "Il y a eu une erreur lors de la recuperation des réponses";
    }
}

async function readMyThreads(identifiant){
        // On essaye de récupérer TOUS les threads (donc on ne met pas de conditions lors de la recherche, juste un object vide)
        try {
            return await Thread.find({identifiant: identifiant})
        }
    
            // S'il y a une erreur, on renvoie un message
        catch (e) {
            return "Il y a eu une erreur lors de la recuperation des posts";
        }
}


async function readThread(threadId) {
    if (threadId === undefined || !isObjectIdStringValid(threadId)) {
        return "L'id du thread n'existe pas ou n'est pas un id MongoDB"
    }
    try {

        
        const threadFound = await Thread.findById(threadId);
        
        if (threadFound === null) {
            return "Le thread n'existe pas"
        }


        return threadFound;
    }

    catch (e) {
        return "Erreur lors de la recherche du thread";
    }
}




// On exporte les modules
module.exports = {
    createThread: createThread,
    readAllThreads: readAllThreads,
    readMyThreads: readMyThreads,
    readThread: readThread,
    readAllResponses: readAllResponses,
}