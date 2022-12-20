# projet-dvp-fullstack
## Projet de développement fullstack en JavaScript

J'ai mis les fonctions de base de l'api qui sont dans le TP

On peut :
 - Créer un utilisateur
 - Modifier un utilisateur 
 - Supprimer un utilisateur
 - Récupérer tous les utilisateurs
 
 
 
### Pour lancer le projet 

#### Etape 1 : Cloner le git (merci t es un génie)

#### Etape 2 : Installer les modules 

Nodejs :
$ sudo apt install nodejs

Docker :
$ sudo apt install docker*

Nodemon :
$ npm install nodemon

ExpressJs :
$ npm install cookie-parser express morgan

MongoDB :
$ npm install mongoose

EJS :
$ npm install ejs

J'ai pas encore regardé pour Redis et les sessions utilisateurs donc force à vous la famille.

#### Etape 3 : Créer un container docker pour lancer le projet 

Créer le container :
On créer un contenur qui contiendra notre bdd. Il s'appelle mongo-bdd.
Le container se lance automatiquement.
(si t appelles ton container autrement que 'mongo-bdd' tu changes juste le nom partout') 

$ docker run -d --name mongo-bdd -p 27017:27017 mongo

-d pour qu'il se lance en arrière plan
-p pour qu'il vous affiche le port 

Supprimer le container :

$ docker rm mongo-bdd

Voir tous les containers en cours d'exécution :

$ sudo docker ps 

Voir tous les containers :

$ sudo docker ps -a 

Lancer un container : 

$ sudo docker start mongo-bdd

Stopper un container :

$ sudo docker stop mongoz-bdd

#### Etape 4 : Lancer le projet 

Une fois que le container est créé, on lance le projet avec 

$ npm start

puis aller sur http://localhost:3000/

ou si vous créer des pages :
http://localhost:3000/nom_de_votre_page

Le prof a créé une page http://localhost:3000/rest où vous pouvez tester toutes les fonctions qu'on a faites en TP. On va partir de ça et s'en inspirer.









