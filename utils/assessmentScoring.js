/**
 * Calcul des scores des questionnaires (fonctions pures, testées dans tests/assessments.test.mjs).
 * Aucune réponse n'est enregistrée : tout reste en mémoire dans la page.
 */

/** Modalités de réponse d'un item (propres à l'item ou communes au questionnaire). */
export function optionsFor(def, index) {
  return def.items[index].options || def.options
}

/** Index de la question suivante après `current`, en appliquant les règles de saut. */
export function nextIndex(def, answers, current) {
  for (const rule of def.skip || []) {
    if (rule.after === current && rule.when(answers)) return rule.goTo
  }
  return current + 1
}

/** Liste des questions effectivement posées, selon les réponses données. */
export function askedPath(def, answers) {
  const path = []
  let i = 0
  while (i < def.items.length) {
    path.push(i)
    if (answers[i] === undefined || answers[i] === null) break
    i = nextIndex(def, answers, i)
  }
  return path
}

/** Vrai quand toutes les questions posées ont une réponse. */
export function isComplete(def, answers) {
  const path = askedPath(def, answers)
  const last = path[path.length - 1]
  return path.every((i) => Number.isInteger(answers[i])) && nextIndex(def, answers, last) >= def.items.length
}

/**
 * Score final : somme des items (inversés si besoin, questions sautées = 0),
 * multipliée le cas échéant (WHO-5 : × 4), puis catégorie correspondante.
 */
export function computeScore(def, answers) {
  if (!isComplete(def, answers)) throw new Error('Questionnaire incomplet')
  const asked = new Set(askedPath(def, answers))
  let raw = 0
  def.items.forEach((item, i) => {
    if (!asked.has(i)) return
    const value = answers[i]
    const values = optionsFor(def, i).map((o) => o.value)
    if (!values.includes(value)) throw new Error(`Réponse invalide à la question ${i + 1}`)
    raw += item.reverse ? Math.min(...values) + Math.max(...values) - value : value
  })
  const score = raw * (def.score.multiplier || 1)
  const band = (def.bands || []).find((b) => score >= b.min && score <= b.max) || null
  return { raw, score, band }
}

/** Vrai si une réponse appelle le message d'aide immédiat (PHQ-9, question 9). */
export function needsSupport(def, answers) {
  return def.items.some((item, i) => item.support && answers[i] > 0)
}
