# Projet Contacts - Front-End

Ce projet est une application front-end construite avec Next.js, TypeScript, et Tailwind CSS. Il permet de gérer une liste de contacts avec des fonctionnalités de création, modification, et suppression de contacts.

## Prérequis

- [Node.js](https://nodejs.org/) (version 20 ou supérieure recommandée)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) ou [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Installation

1. Clonez le dépôt :

   `git clone https://github.com/JnT-9/contactsfront.git`

   `cd contactsfront`

2. Installez les dépendances :

   Avec **Yarn** :
   `yarn install`

   Avec **npm** :
   `npm install`

## Lancer le projet

1. Démarrez le serveur de développement :

   Avec **Yarn** :
   `yarn dev`

   Avec **npm** :
   `npm run dev`

   Le projet sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

2. Construisez le projet pour la production (optionnel) :

   Avec **Yarn** :
   `yarn build`

   Avec **npm** :
   `npm run build`

   Vous pouvez ensuite démarrer le serveur de production avec :

   Avec **Yarn** :
   `yarn start`

   Avec **npm** :
   `npm run start`

## Structure du projet

- **app**
  - `page.tsx` : Page d'accueil qui affiche la liste des contacts et un bouton pour ajouter un nouveau contact.
  - `contacts/[id].tsx` : Page de détail pour un contact spécifique, avec des options pour éditer ou supprimer le contact.
- **components/**
  - `ContactForm.tsx` : Formulaire pour ajouter ou éditer un contact.
  - `ContactList.tsx` : Liste des contacts avec options de recherche et de sélection des champs affichés.
- **type.ts** : Déclaration des types TypeScript utilisés dans le projet.
- **tailwind.css** : Fichier CSS pour la configuration de Tailwind CSS.

## Configuration de Tailwind CSS

1. Initialisation de Tailwind CSS (si non fait automatiquement) :

   `npx tailwindcss init`

2. Configurez le fichier `tailwind.config.js` pour inclure les chemins des fichiers où Tailwind CSS sera utilisé :

   ```js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./app/**/*.{js,ts,jsx,tsx}",
       "./pages/**/*.{js,ts,jsx,tsx}",
       "./components/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. Ajoutez les directives Tailwind CSS à votre fichier CSS principal (`./styles/globals.css` ou un fichier similaire) :

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
