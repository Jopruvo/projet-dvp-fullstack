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

    thread.contenu = (thread.contenu).trim();
    const content = thread.contenu;

    const neededKeys = ["identifiant", "contenu"];
    const keysNotGiven = getKeysNotProvided(neededKeys, thread);

    if(thread.reponse === undefined) // C'est un thread
    {
        // On regarde déjà si tous les champs de l'utilisateur sont présents

        // On supprime les espaces au début et à la fin de la chaîne de charactères.
        thread.titre = (thread.titre).trim();
        const title = thread.titre;

        // Si une ou plusieurs clefs ne sont pas données alors on renvoie un message d'erreur
        if (title === '' || content === '') {
            return `Message invalide`;
        }
    }
    else
    { // Réponse
        if (content === '') 
        {
            return `Message invalide`;
        }
    }

    if (keysNotGiven.length !== 0) {
        return `Remplissez toutes les informations`;
    }



    // On peut essayer de créer le thread
    try {

        // On crée un thread avec le model de MongoDB et les informations du thread
        const threadToCreate = new Thread(thread);
        
        // Puis on le sauvegarde en n'oubliant pas le mot clef await qui va nous permettre d'attendre que le thread
        // soit sauvegarder pour nous le renvoyer

        await threadToCreate.save();
    
        return "Ok";
    }

        // S'il y a une erreur lors du processus alors on renvoie un message d'erreur
    catch (e) {
        throw e; //"Une erreur s'est produite lors de la création de votre thread";
    }
    
}

async function getOwnerThread(idThread)
{
    const getThread = await Thread.findById(idThread);

    return getThread.identifiant;
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
            return await Thread.find({reponse:undefined, identifiant: identifiant})
        }
    
            // S'il y a une erreur, on renvoie un message
        catch (e) {
            return "Il y a eu une erreur lors de la recuperation des posts";
        }
}

async function deleteThread(threadId){
        if (threadId === undefined || !isObjectIdStringValid(threadId)) {
            return "L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB"
        }
    
        try {
    
            const threadDeleted = await Thread.findByIdAndDelete(threadId);

            const listResponse = await Thread.find({reponse: threadId})
            
            for(let i = 0; i < listResponse.size(); i++){
                await Thread.findByIdAndDelete(listResponse[i].id);
            }

            if (threadDeleted === null) {
                return "Le thread n'existe pas et n'a donc pas pû être supprimé"
            }
    
            return threadDeleted;
        }
    
        catch (e) {
            return "Erreur lors de la suppression du thread";
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
    deleteThread: deleteThread,
    getOwnerThread: getOwnerThread
}