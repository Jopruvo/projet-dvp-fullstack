# Projet de développement fullstack en JavaScript

J'ai mis les fonctions de base de l'api qui sont dans le TP

On peut :
 - Créer un utilisateur
 - Créer un thread
 - Supprimer un thread
 - Répondre à un thread
 - Etre administrateur
 
## Pour lancer le projet 

### Etape 1 : Cloner le git (merci t'es un génie)

### Etape 2 : Installer les modules 

$ npm install

### Etape 3 : Créer un container docker pour lancer le projet 

#### Créer le container :
On créer un conteneur qui contiendra notre bdd. Il s'appelle mongo-bdd.
Le container se lance automatiquement.
(si t appelles ton container autrement que 'mongo-bdd' tu changes juste le nom partout') 

$ docker run -d --name mongo-bdd -p 27017:27017 mongo

-d pour qu'il se lance en arrière plan
-p pour qu'il vous affiche le port 

#### Lancer le container : 

$ sudo docker start mongo-bdd

### Etape 4 : Créer la bdd redis

De la même manière qu'au dessus, on utilise docker pour gérer la bdd redis qui va nous servir pour les sessions.

$ docker run -d --name redis-bdd -p 6379:6379 redis
$ docker stop redis-bdd
$ docker start redis-bdd

### Etape 5 : Lancer le projet 

Une fois que le container est créé, on lance le projet avec 

$ npm start
ou
$ npm run dev

Puis aller sur http://localhost:3000/

### Etape 6 : Compte admin

identifiant : admin
mdp : admin






