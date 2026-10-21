/**
 * Export des résultats d'un questionnaire en PDF, généré entièrement dans le navigateur :
 * aucune donnée n'est envoyée sur internet.
 */
import { computeScore, itemDetails, needsSupport } from './assessmentScoring.js'

const pad = (n) => String(n).padStart(2, '0')

/** Contenu du rapport, indépendant de la mise en page (testable). */
export function buildReport(def, answers, { extraAnswer = null, name = '', date = new Date() } = {}) {
  const { score, band } = computeScore(def, answers)
  const unit = def.score.unit ? ` ${def.score.unit}` : ''
  return {
    title: def.title,
    date: `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} à ${pad(date.getHours())} h ${pad(date.getMinutes())}`,
    fileDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    name: name.trim(),
    score: `${score} / ${def.score.max}${unit}`,
    interpretation: band ? band.label : def.resultText || '',
    advice: band?.advice || '',
    support: needsSupport(def, answers)
      ? 'Réponse non nulle à la question 9 : quel que soit le score total, cette réponse justifie d’en parler rapidement à un professionnel de santé. Numéro national de prévention du suicide : 3114 (gratuit, 24 h/24). Danger immédiat : 15 ou 112.'
      : '',
    extra: extraAnswer ? `${def.extra.text}\nRéponse : ${extraAnswer.label} (non compté dans le score)` : '',
    instruction: def.instruction,
    items: itemDetails(def, answers),
    scoreNote: def.scoreNote,
    disclaimer:
      'Ce document n’est pas un diagnostic. Il reflète les réponses données à un moment précis et doit être interprété par un professionnel de santé.',
    source: [def.source.version, def.source.authors, def.source.reference, def.source.licence],
  }
}

// Les polices standard des PDF ne contiennent pas tous les signes typographiques
const clean = (s) => String(s).replace(/[’‘]/g, "'").replace(/[“”«»]/g, '"').replace(/ | /g, ' ')

/** Génère et télécharge le PDF. */
export async function downloadReportPdf(report, shortName) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const M = 18
  const W = 210 - 2 * M
  let y = M

  const ensure = (h) => {
    if (y + h > 297 - M) {
      doc.addPage()
      y = M
    }
  }
  const text = (s, { size = 10, style = 'normal', color = [40, 40, 40], gap = 1.5, indent = 0 } = {}) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(clean(s), W - indent)
    const lh = size * 0.42
    for (const line of lines) {
      ensure(lh)
      doc.text(line, M + indent, y)
      y += lh
    }
    y += gap
  }
  const rule = () => {
    ensure(4)
    doc.setDrawColor(200)
    doc.line(M, y, M + W, y)
    y += 5
  }

  text(report.title, { size: 15, style: 'bold', gap: 2 })
  text(`Rempli le ${report.date}${report.name ? ` — ${report.name}` : ''}`, { size: 10, color: [90, 90, 90], gap: 4 })
  rule()

  text(`Score : ${report.score}`, { size: 13, style: 'bold', gap: 1.5 })
  if (report.interpretation) text(report.interpretation, { size: 11, style: 'bold', gap: 1.5 })
  if (report.advice) text(report.advice, { gap: 1.5 })
  if (report.support) text(report.support, { style: 'bold', color: [180, 20, 20], gap: 2 })
  text(report.scoreNote, { size: 9, color: [90, 90, 90], gap: 3 })
  if (report.extra) text(report.extra, { gap: 3 })
  rule()

  text('Réponses', { size: 12, style: 'bold', gap: 1.5 })
  text(report.instruction, { size: 9, color: [90, 90, 90], gap: 3 })
  for (const it of report.items) {
    text(`${it.number}. ${it.text}`, { style: 'bold', gap: 0.8 })
    const answer = it.skipped
      ? 'Question non posée (règle de saut du questionnaire) — 0 point'
      : `${it.answer} — ${it.points} point${it.points > 1 ? 's' : ''}${it.reversed ? ' (cotation inversée)' : ''}`
    text(answer, { indent: 5, color: [70, 70, 70], gap: 2.5 })
  }
  rule()

  text(report.disclaimer, { size: 9, gap: 3 })
  text('Source', { size: 9, style: 'bold', gap: 0.8 })
  for (const s of report.source) text(s, { size: 8, color: [110, 110, 110], gap: 0.8 })
  y += 2
  text('Document généré localement par Ma boussole bien-être ; aucune donnée n’a été transmise.', { size: 8, color: [110, 110, 110] })

  doc.save(`${shortName}_${report.fileDate}.pdf`)
}
