// Tests des questionnaires : node --test tests/
import test from 'node:test'
import assert from 'node:assert/strict'
import { assessments, getAssessment } from '../data/assessments.js'
import { askedPath, computeScore, isComplete, needsSupport } from '../utils/assessmentScoring.js'

const fill = (n, v) => Array(n).fill(v)
const band = (slug, answers) => computeScore(getAssessment(slug), answers).band?.label
const score = (slug, answers) => computeScore(getAssessment(slug), answers).score

test('structure des questionnaires', () => {
  const expected = { 'phq-9': 9, 'gad-7': 7, 'who-5': 5, audit: 10, rosenberg: 10 }
  for (const [slug, n] of Object.entries(expected)) assert.equal(getAssessment(slug).items.length, n, slug)
  for (const a of assessments) {
    // les catégories couvrent tout l'intervalle de score sans trou ni chevauchement
    const bands = [...a.bands].sort((x, y) => x.min - y.min)
    for (let i = 1; i < bands.length; i++) assert.ok(bands[i].min > bands[i - 1].max, `${a.slug} chevauchement`)
    if (bands.length) {
      assert.equal(bands[0].min, a.score.min, `${a.slug} début`)
      assert.equal(bands.at(-1).max, a.score.max, `${a.slug} fin`)
    }
  }
})

test('PHQ-9 : seuils 5, 10, 15, 20', () => {
  const at = (total) => {
    const a = fill(9, 0)
    for (let i = 0; i < total; i++) a[i % 8] += 1 // n'utilise pas la question 9
    return a
  }
  assert.equal(score('phq-9', fill(9, 3)), 27)
  assert.match(band('phq-9', at(4)), /minimes/)
  assert.match(band('phq-9', at(5)), /légers/)
  assert.match(band('phq-9', at(9)), /légers/)
  assert.match(band('phq-9', at(10)), /modérés/)
  assert.match(band('phq-9', at(14)), /modérés/)
  assert.match(band('phq-9', at(15)), /modérément sévères/)
  assert.match(band('phq-9', at(19)), /modérément sévères/)
  assert.match(band('phq-9', at(20)), /sévères/)
  assert.doesNotMatch(band('phq-9', at(20)), /modérément/)
})

test('PHQ-9 : message d’aide dès que la question 9 est non nulle', () => {
  const def = getAssessment('phq-9')
  assert.equal(needsSupport(def, fill(9, 0)), false)
  assert.equal(needsSupport(def, [...fill(8, 0), 1]), true)
  assert.equal(needsSupport(def, [...fill(8, 3), 0]), false)
  assert.equal(needsSupport(def, [1]), false) // question 9 pas encore posée
})

test('GAD-7 : seuils 5, 10, 15', () => {
  assert.equal(score('gad-7', fill(7, 3)), 21)
  assert.match(band('gad-7', [3, 1, 0, 0, 0, 0, 0]), /minimes/)
  assert.match(band('gad-7', [3, 2, 0, 0, 0, 0, 0]), /légers/)
  assert.match(band('gad-7', [3, 3, 3, 1, 0, 0, 0]), /modérés/)
  assert.match(band('gad-7', [3, 3, 3, 3, 3, 0, 0]), /sévères/)
})

test('WHO-5 : score × 4, seuils 28 et 50', () => {
  assert.equal(score('who-5', fill(5, 5)), 100)
  assert.equal(score('who-5', fill(5, 0)), 0)
  assert.match(band('who-5', [2, 2, 2, 1, 0]), /très diminué/) // brut 7 → 28
  assert.match(band('who-5', [2, 2, 2, 2, 0]), /^Bien-être diminué/) // brut 8 → 32
  assert.match(band('who-5', [3, 3, 3, 3, 0]), /^Bien-être diminué/) // brut 12 → 48
  assert.match(band('who-5', [3, 3, 3, 3, 1]), /Pas de diminution/) // brut 13 → 52
})

test('AUDIT : sauts du manuel de l’OMS et zones', () => {
  const def = getAssessment('audit')
  // ne boit jamais → questions 9 et 10 seulement
  assert.deepEqual(askedPath(def, [0, undefined]), [0, 8])
  assert.equal(isComplete(def, [0]), false)
  const abstinent = [0]
  abstinent[8] = 2
  abstinent[9] = 0
  assert.equal(isComplete(def, abstinent), true)
  assert.equal(score('audit', abstinent), 2)
  // questions 2 + 3 = 0 → saut aux questions 9 et 10, réponses intermédiaires ignorées
  const light = [1, 0, 0, 4, 4, 4, 4, 4, 0, 0]
  assert.deepEqual(askedPath(def, light), [0, 1, 2, 8, 9])
  assert.equal(score('audit', light), 1)
  // maximum
  assert.equal(score('audit', fill(10, 4)), 40)
  assert.match(band('audit', [2, 1, 1, 1, 1, 1, 0, 0, 0, 0]), /Zone I /) // 7
  assert.match(band('audit', [2, 1, 1, 1, 1, 1, 1, 0, 0, 0]), /Zone II /) // 8
  assert.match(band('audit', [4, 4, 4, 4, 0, 0, 0, 0, 0, 0]), /Zone III /) // 16
  assert.match(band('audit', [4, 4, 4, 4, 4, 0, 0, 0, 0, 0]), /Zone IV /) // 20
  // réponse impossible pour les questions 9-10 (seulement 0, 2 ou 4)
  assert.throws(() => computeScore(def, [4, 4, 4, 4, 4, 4, 4, 4, 1, 0]))
})

test('Rosenberg : items 3, 5, 8, 9, 10 inversés, score 10 à 40', () => {
  const def = getAssessment('rosenberg')
  assert.deepEqual(
    def.items.map((it, i) => (it.reverse ? i + 1 : null)).filter(Boolean),
    [3, 5, 8, 9, 10]
  )
  assert.equal(score('rosenberg', fill(10, 4)), 25) // tout « tout à fait en accord »
  assert.equal(score('rosenberg', [4, 4, 1, 4, 1, 4, 4, 1, 1, 1]), 40)
  assert.equal(score('rosenberg', [1, 1, 4, 1, 4, 1, 1, 4, 4, 4]), 10)
  assert.equal(band('rosenberg', fill(10, 4)), undefined) // pas de seuil officiel
})
