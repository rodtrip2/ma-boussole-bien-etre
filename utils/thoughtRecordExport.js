/**
 * Export PDF de la fiche « Questionner une pensée », généré dans le navigateur
 * (jsPDF chargé à la demande) : aucune donnée n'est envoyée sur internet.
 */
const clean = (s) => String(s ?? '').replace(/[’‘]/g, "'").replace(/[“”«»]/g, '"').replace(/ | /g, ' ')
const pad = (n) => String(n).padStart(2, '0')

/** Sections du rapport, indépendantes de la mise en page. */
export function buildThoughtRecord(record, labels, date = new Date()) {
  const L = labels
  const sections = [
    [L.situation, record.situation],
    [L.emotions, `${record.emotions.join(', ') || '—'} (${L.intensity} ${record.intensityBefore}/100)`],
    [L.thought, `${record.thought || '—'} (${L.belief} ${record.beliefBefore}/100)`],
  ]
  if (record.traps.length) sections.push([L.traps, record.traps.join(', ')])
  sections.push([L.for, record.evidenceFor || '—'], [L.against, record.evidenceAgainst || '—'])
  sections.push([L.alternative, `${record.alternative || '—'} (${L.belief} ${record.beliefAlternative}/100)`])
  if (record.intensityAfter !== null) sections.push([L.outcome, `${record.intensityBefore}/100 -> ${record.intensityAfter}/100`])
  return {
    title: L.title,
    date: `${L.date} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
    fileDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    sections,
    footer: L.footer,
  }
}

export async function downloadThoughtRecordPdf(report) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const M = 18
  const W = 210 - 2 * M
  let y = M
  const text = (s, { size = 10, style = 'normal', color = [40, 40, 40], gap = 1.5 } = {}) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lh = size * 0.42
    for (const line of doc.splitTextToSize(clean(s), W)) {
      if (y + lh > 297 - M) {
        doc.addPage()
        y = M
      }
      doc.text(line, M, y)
      y += lh
    }
    y += gap
  }
  text(report.title, { size: 15, style: 'bold', gap: 2 })
  text(report.date, { color: [90, 90, 90], gap: 5 })
  for (const [label, value] of report.sections) {
    text(label, { size: 11, style: 'bold', gap: 1 })
    text(value || '—', { gap: 4 })
  }
  y += 2
  text(report.footer, { size: 8, color: [110, 110, 110] })
  doc.save(`Fiche-pensee_${report.fileDate}.pdf`)
}
