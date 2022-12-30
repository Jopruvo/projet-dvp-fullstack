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
    const neededKeys = ["reponse", "identifiant", "titre", "contenu"];
    const keysNotGiven = getKeysNotProvided(neededKeys, user);

    // Si une ou plusieurs clefs ne sont pas données alors on renvoie un message d'erreur
    if (keysNotGiven.length !== 0) {
        return `Remplissez toutes les informations`;
    }



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
        return "Une erreur s'est produite lors de la création de votre thread";
    }



    
}