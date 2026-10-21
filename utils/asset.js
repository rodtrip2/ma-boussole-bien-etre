/* global __APP_BASE_URL__ */

/**
 * Préfixe un chemin de fichier public (dossier public/) avec l'URL de base du site,
 * pour que le site fonctionne aussi dans un sous-dossier (ex. GitHub Pages).
 * La base est fixée à la compilation via NUXT_APP_BASE_URL (voir nuxt.config.ts).
 * @param {string} path - chemin commençant par « / », ex. « /audios/x.mp3 »
 */
export function asset(path) {
  const base = typeof __APP_BASE_URL__ === 'string' ? __APP_BASE_URL__ : '/'
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
}
