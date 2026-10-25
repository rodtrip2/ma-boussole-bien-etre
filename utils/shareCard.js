/**
 * Partage du site : QR code, carte image (JPG) et planche de cartes à imprimer (PDF).
 * Tout est généré dans le navigateur, hors ligne : aucun service extérieur n'est appelé.
 */

// Format carte de visite : 85 × 55 mm (image 1700 × 1100 px, soit 20 px par mm)
export const CARD_MM = { w: 85, h: 55 }
export const CARD_PX = { w: 1700, h: 1100 }

// Fleur de lotus du logo (voir components/AATLogo.vue)
const LOTUS_PATH =
  'M879.423 322.501C877.233 318.65 874.298 315.275 870.79 312.572C867.282 309.869 863.271 307.893 858.991 306.758C843.464 302.762 827.42 301.154 811.41 301.99C819.994 259.358 813.556 225.638 807.117 205.643C804.491 197.43 798.905 190.489 791.448 186.17C783.99 181.851 775.193 180.463 766.769 182.276C744.929 187.142 724.163 195.964 705.495 208.306C691.821 180.357 671.915 155.925 647.311 136.894C641.349 132.419 634.097 130 626.644 130C619.19 130 611.938 132.419 605.976 136.894C581.333 155.913 561.389 180.346 547.685 208.306C529.017 195.964 508.251 187.142 486.411 182.276C477.989 180.454 469.191 181.838 461.734 186.159C454.278 190.48 448.698 197.426 446.084 205.643C439.646 225.638 433.207 259.336 441.663 301.99C425.653 301.154 409.608 302.762 394.082 306.758C389.802 307.893 385.791 309.869 382.283 312.572C378.775 315.275 375.84 318.65 373.65 322.501C371.361 326.442 369.878 330.8 369.289 335.321C368.699 339.842 369.014 344.434 370.216 348.832C377.492 375.85 399.834 427.202 467.503 467.666C535.173 508.129 594.622 508 626.644 508C658.665 508 718.222 508 785.462 467.666C853.132 427.202 875.474 375.85 882.749 348.832C883.967 344.441 884.3 339.852 883.729 335.332C883.158 330.812 881.694 326.45 879.423 322.501ZM485.102 438.177C427.949 403.986 409.384 362.062 403.332 339.833C419.122 335.931 435.512 335.078 451.621 337.32C456.999 351.738 463.568 365.682 471.259 379.008C490.143 411.586 514.882 440.392 544.23 463.972C523.478 457.999 503.599 449.327 485.102 438.177ZM626.536 470.2C606.512 455.295 557.858 409.57 557.858 317.217C557.858 226.003 605.89 179.913 626.536 164.364C647.183 179.956 695.215 226.046 695.215 317.26C695.215 409.57 646.56 455.295 626.536 470.2ZM849.741 339.876C843.796 361.869 825.274 403.9 767.992 438.177C749.494 449.319 729.615 457.984 708.864 463.95C738.212 440.37 762.951 411.565 781.835 378.986C789.527 365.66 796.095 351.716 801.473 337.299C817.578 335.078 833.959 335.946 849.741 339.854V339.876Z'

const PINK = '#EC4899'
const PINK_DARK = '#BE185D'
const PINK_LIGHT = '#FDF2F8'
const FONT = '"Inter Variable", Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

/** Adresse du site à partager (page d'accueil dans la langue choisie). */
export function siteUrl(baseUrl, locale) {
  const base = baseUrl.replace(/\/?$/, '/')
  return locale === 'fr' ? base : `${base}${locale}/`
}

/** Adresse lisible, sans « https:// » ni barre finale. */
export const displayUrl = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

/** Matrice du QR code : { size, isDark(row, col) }. */
export async function makeQr(url) {
  const mod = await import('qrcode-generator')
  const qrcode = mod.default || mod
  const qr = qrcode(0, 'M')
  qr.addData(url)
  qr.make()
  const size = qr.getModuleCount()
  return { size, isDark: (r, c) => qr.isDark(r, c) }
}

/** Tracé SVG du QR code (un seul chemin), coordonnées en modules. */
export function qrSvgPath(qr) {
  let d = ''
  for (let r = 0; r < qr.size; r++) {
    for (let c = 0; c < qr.size; c++) {
      if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`
    }
  }
  return d
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Écrit un texte sur une ligne en réduisant la taille si besoin pour tenir dans maxWidth. */
function fitText(ctx, text, x, y, maxWidth, size, weight) {
  let s = size
  do {
    ctx.font = `${weight} ${s}px ${FONT}`
    if (ctx.measureText(text).width <= maxWidth) break
    s -= 2
  } while (s > 12)
  ctx.fillText(text, x, y)
  return s
}

/** Texte sur plusieurs lignes ; renvoie l'ordonnée sous la dernière ligne. */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/)
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y)
      line = w
      y += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, y)
  return y + lineHeight
}

/**
 * Dessine la carte sur un canvas.
 * @param {object} t - textes : title, tagline, subtitle, features, scan
 */
export async function renderCard({ url, qr, t }) {
  try {
    await Promise.all([
      document.fonts.load(`700 60px ${FONT}`),
      document.fonts.load(`500 40px ${FONT}`),
      document.fonts.load(`400 40px ${FONT}`),
    ])
  } catch {
    /* police système à défaut */
  }

  const { w: W, h: H } = CARD_PX
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'alphabetic'

  // Fond
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // Panneau du QR code, à droite
  const panelX = 1080
  ctx.fillStyle = PINK_LIGHT
  ctx.fillRect(panelX, 0, W - panelX, H)
  ctx.fillStyle = PINK
  ctx.fillRect(panelX, 0, 10, H)

  // Logo
  const logo = new Path2D(LOTUS_PATH)
  const logoSize = 170
  ctx.save()
  ctx.translate(100, 95)
  ctx.scale(logoSize / 560, logoSize / 560)
  ctx.translate(-346, -39)
  ctx.fillStyle = PINK
  ctx.fill(logo)
  ctx.restore()

  // Textes
  const left = 110
  const maxW = panelX - left - 80
  ctx.fillStyle = '#1F2937'
  fitText(ctx, t.title, left, 390, maxW, 92, 700)

  ctx.fillStyle = PINK_DARK
  fitText(ctx, t.tagline, left, 480, maxW, 56, 600)

  ctx.fillStyle = '#4B5563'
  ctx.font = `400 44px ${FONT}`
  wrapText(ctx, t.subtitle, left, 580, maxW, 58)

  ctx.fillStyle = '#6B7280'
  fitText(ctx, t.features, left, 880, maxW, 38, 500)

  ctx.fillStyle = '#1F2937'
  fitText(ctx, displayUrl(url), left, 975, maxW, 40, 700)

  // QR code dans un carré blanc
  const box = 500
  const bx = panelX + 10 + (W - panelX - 10 - box) / 2
  const by = 235
  ctx.save()
  ctx.shadowColor = 'rgba(190, 24, 93, 0.15)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 8
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, bx, by, box, box, 36)
  ctx.fill()
  ctx.restore()

  const margin = 44
  const cell = Math.floor((box - 2 * margin) / qr.size)
  const qrPx = cell * qr.size
  const qx = Math.round(bx + (box - qrPx) / 2)
  const qy = Math.round(by + (box - qrPx) / 2)
  ctx.fillStyle = '#111827'
  for (let r = 0; r < qr.size; r++) {
    for (let c = 0; c < qr.size; c++) {
      if (qr.isDark(r, c)) ctx.fillRect(qx + c * cell, qy + r * cell, cell, cell)
    }
  }

  ctx.fillStyle = '#374151'
  ctx.textAlign = 'center'
  fitText(ctx, t.scan, bx + box / 2, by + box + 90, W - panelX - 80, 38, 500)
  ctx.textAlign = 'left'

  return canvas
}

export const canvasToJpeg = (canvas, quality = 0.92) =>
  new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/jpeg', quality))

/** Télécharge un fichier généré dans le navigateur. */
export function downloadBlob(blob, filename) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 4000)
}

// Les polices standard des PDF ne contiennent pas tous les signes typographiques
const clean = (s) => String(s).replace(/[’‘]/g, "'").replace(/[“”«»]/g, '"').replace(/ | /g, ' ')

/**
 * Planche A4 de 10 cartes (2 × 5) au format 85 × 55 mm, avec traits de coupe.
 * @param {HTMLCanvasElement} canvas - la carte rendue par renderCard
 * @param {string} header - consigne d'impression affichée en haut de page
 */
export async function buildSheetPdf(canvas, header) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const cols = 2
  const rows = 5
  const { w, h } = CARD_MM
  const x0 = (210 - cols * w) / 2 // 20 mm
  const y0 = (297 - rows * h) / 2 // 11 mm
  const img = canvas.toDataURL('image/jpeg', 0.92)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      doc.addImage(img, 'JPEG', x0 + c * w, y0 + r * h, w, h, 'carte', 'NONE')
    }
  }

  // Traits de découpe légers entre les cartes
  doc.setDrawColor(210)
  doc.setLineWidth(0.1)
  doc.setLineDashPattern([1, 1], 0)
  for (let c = 0; c <= cols; c++) doc.line(x0 + c * w, y0, x0 + c * w, y0 + rows * h)
  for (let r = 0; r <= rows; r++) doc.line(x0, y0 + r * h, x0 + cols * w, y0 + r * h)
  doc.setLineDashPattern([], 0)

  // Repères de coupe dans les marges
  doc.setDrawColor(120)
  doc.setLineWidth(0.2)
  const L = 5 // marges latérales : 20 mm
  const Lv = 3 // marges haute et basse : 11 mm (la consigne est imprimée au-dessus)
  const gap = 1.5
  for (let c = 0; c <= cols; c++) {
    const x = x0 + c * w
    doc.line(x, y0 - gap - Lv, x, y0 - gap)
    doc.line(x, y0 + rows * h + gap, x, y0 + rows * h + gap + Lv)
  }
  for (let r = 0; r <= rows; r++) {
    const y = y0 + r * h
    doc.line(x0 - gap - L, y, x0 - gap, y)
    doc.line(x0 + cols * w + gap, y, x0 + cols * w + gap + L, y)
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(120)
  doc.text(clean(header), 105, 4, { align: 'center', baseline: 'middle' })

  return doc.output('blob')
}
