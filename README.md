<div align="center">

<img src="public/aat.svg" alt="Logo Ma boussole bien-être" width="140" height="140" />

# Ma boussole bien-être

**Exercices d’apaisement et questionnaires d’auto-évaluation — gratuits, sans inscription, sans pistage**

[**Ouvrir le site**](https://rodtrip2.github.io/ma-boussole-bien-etre/) · Licence GPL-3.0

</div>

## Ce que propose le site

- **12 exercices** : respiration en 2 minutes, respiration guidée (dont la cohérence cardiaque), temps d’inquiétude, ancrage 5-4-3-2-1, relaxation musculaire
  progressive, visualisations apaisantes narrées en français, étiquetage des pensées, thérapie sonore, bulles,
  balle anti-stress, toupie.
- **5 questionnaires d’auto-évaluation** en versions françaises validées : PHQ-9 (humeur), GAD-7 (anxiété),
  WHO-5 (bien-être), AUDIT (alcool), échelle d’estime de soi de Rosenberg. Résultat selon les seuils des auteurs,
  export PDF, message d’aide (3114) pour la question 9 du PHQ-9.
- **Trouver de l’aide** : page des numéros d’urgence et d’écoute en France (3114, SOS Amitié, Fil Santé Jeunes, Mon soutien psy, CMP…).
- **Respect de la vie privée** : aucune inscription, aucune statistique de visite, aucune requête vers un
  service extérieur ; les réponses aux questionnaires ne sont jamais enregistrées.
- Français par défaut et version anglaise ; utilisable hors ligne une fois visité.

> Ce site aide à faire le point et à s’apaiser ; il ne remplace pas un avis médical.

## Installer ou héberger

Le site est un ensemble de pages HTML statiques, hébergeables sur n’importe quel serveur web.

```bash
npm ci
npx nuxt generate        # site complet dans .output/public
npm test                 # tests des calculs des questionnaires
```

- **GitHub Pages** : publication automatique à chaque modification de `main`
  (`.github/workflows/pages.yml`, source « GitHub Actions » dans Settings → Pages).
- **Sous-dossier** : compiler avec `NUXT_APP_BASE_URL=/nom-du-dossier/`.
- **Docker** : `docker compose up -d`, puis http://localhost:8080.
- **Développement** : `npm run dev`.

## Organisation du code

| Dossier | Contenu |
| --- | --- |
| `pages/` | Pages du site (exercices, `self-tests/` pour les questionnaires) |
| `components/` | Composants des exercices, en-tête, pied de page, message d’aide |
| `data/assessments.js` | Textes des questionnaires (versions validées, ne pas modifier sans vérifier la source) |
| `utils/` | Calcul des scores, export PDF, sons |
| `i18n/locales/` | Traductions |
| `public/audios/` | Narrations et sons |

## Crédits

Ce projet est dérivé d’[Anxiety Aid Tools](https://github.com/alvinunreal/anxiety-aid-tools)
(Alvin Unreal et contributeurs), dont il reprend la dernière version libre (v2.0, novembre 2025) sous licence
GPL-3.0. Narrations générées avec ElevenLabs par le projet d’origine. Les illustrations et sons du projet
d’origine sont distribués sous la même licence GPL-3.0.

Les questionnaires restent la propriété de leurs auteurs ; leurs sources et conditions d’utilisation sont
indiquées sur chaque page du site.

## Licence

GPL-3.0 : vous pouvez utiliser, modifier et redistribuer ce projet, à condition de conserver la même licence.
