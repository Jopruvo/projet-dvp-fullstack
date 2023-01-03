const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Ce schema sera utilisé pour stocker les utilisateurs
 * @schema : User
 */
const UserSchema = new Schema({

    /**
     * L'identifiant de l'utilisateur
     */    
    identifiant: {
        type: Schema.Types.String,
        required: true,
        unique: true 
    },

    /**
     * Le mot de passe de l'utilisateur
     */    
    mdp: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Le nom de l'utilisateur
     */
    nom: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Le prénom de l'utilisateur
     */
    prenom: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * L'age de l'utilisateur
     */
    age: {
        type: Schema.Types.Number,
        required: true
    },

    /**
     * Ce champ sera pour savoir quand un utilisateur a été ajouté la base de données
     * Le fait de mettre 'default: Date.now' permettra de créer ce champ sans devoir le renseigner et sera la date au moment de l'ajout du document
     */
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    }
});

const ThreadSchema = new Schema({

    /**
     * Si le message est une réponse à un autre message, alors on met ici l'id du message auxquel on répond, sinon on met 0 de base 
     */
    reponse: {
        type: Schema.Types.ObjectId,
        required: false
    },


    /**
     * L'identifiant de l'utilisateur qui a poste le thread
     */    
    identifiant: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Le titre du thread
     */
    titre: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Le contenu du thread
     */
    contenu: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Ce champ sera pour savoir quand un thread a été ajouté la base de données
     * Le fait de mettre 'default: Date.now' permettra de créer ce champ sans devoir le renseigner et sera la date au moment de l'ajout du document
     */
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    }
});



// On exporte les models
module.exports = {

    // On dit que le Model User est créé à partir du Schema UserSchema et le Model sera stocké dans la base de donnée MongoDB sous le nom "user"
    User: mongoose.model('user', UserSchema),
    Thread: mongoose.model('thread', ThreadSchema)
}