# Déploiement du Tuteur IA — 3 étapes

## 1. Créer ton compte Cloudflare (2 min, gratuit)

Va sur : https://dash.cloudflare.com/sign-up

Email + mot de passe, confirme l'email. C'est tout. Pas de CB demandée pour le free tier.

## 2. Te connecter à Cloudflare depuis ton terminal

Dans ton terminal (ici), lance :

```
! cd "C:\Users\BENDJ\Desktop\TRADING_ACADEMY\_ai\worker" && npx wrangler login
```

Le `!` au début dit à Claude Code d'exécuter dans TON shell (un navigateur s'ouvrira). Clique "Allow" dans la page Cloudflare, ferme le navigateur.

## 3. Me dire "login OK"

Je lance la suite automatiquement :
- Création du KV namespace (rate limiting)
- Configuration du secret Gemini
- Build + deploy du Worker
- Patch `chat.js` avec ton URL de Worker
- Inclusion du widget sur toutes les pages

Tu auras l'URL finale à copier dans le site.
