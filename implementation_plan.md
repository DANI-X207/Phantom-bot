# Phantom Web Dashboard

L'objectif est de créer un **tableau de bord web ultra-premium** qui permet de gérer l'état de la connexion de Phantom Bot (scan de QR Code, état de la session, et réinitialisation de session forcée).

## Proposed Changes

### [NEW] `public/index.html` (Interface Web)
Création d'une interface web moderne et esthétique avec :
- Un design "Glassmorphism" (transparence, fond animé ou sombre).
- Affichage de l'état actuel : **En attente de Scan (QR Code affiché)**, **Connecté**, ou **Déconnecté**.
- Un bouton rouge **"Forcer une nouvelle session"** qui permet de supprimer la session actuelle même si le bot est connecté, pour générer un tout nouveau QR Code.

### [NEW] `public/style.css` & `public/script.js`
- Fichiers pour gérer les animations fluides, la logique de récupération de statut automatique (polling HTTP vers l'API interne) et les actions de clic.

### [MODIFY] `index.js` (Logique Serveur)
- **Serveur Express intégré :** Lancement d'un serveur HTTP local (par exemple sur le port `3000`) directement dans le fichier principal du bot.
- **Stockage d'état global :**
  - Conserver le dernier `qr` généré sous forme de code base64 d'image (via la librairie `qrcode`).
  - Conserver l'état de la connexion (`qr`, `connected`, `close`).
- **Création de l'API Interne :**
  - `/api/status` : Renvoie l'état actuel de la connexion et l'image du QR Code s'il y en a un.
  - `/api/reset` : Exécute une routine de nettoyage : appel à `sock.logout()`, arrêt brutal des processus si besoin, suppression du dossier `session/` avec `fs-extra`, et redémarrage de `startBot()` pour générer un nouveau QR.

## Open Questions

> [!WARNING]
> Le serveur web sera accessible à l'adresse **http://localhost:3000** sur ta machine locale. Ce port te convient-il ?
>
> Pour le bouton "Afficher un nouveau QR" (qui supprime la session actuelle), veux-tu que j'ajoute une petite pop-up de confirmation pour éviter de te déconnecter par erreur ?
