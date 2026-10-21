/**
 * Questionnaires d'auto-évaluation — versions françaises validées.
 *
 * Les libellés des items, consignes et modalités de réponse reprennent mot pour mot
 * les versions sources citées dans `source` (seule exception signalée : la consigne
 * « en encerclant le chiffre approprié » de la RSES, retirée pour l'usage en ligne).
 * Toute modification de ces textes doit être vérifiée contre la source.
 *
 * Structure :
 *  - items[].options : si absent, on utilise `options` du questionnaire
 *  - score : { reverse, multiplier, min, max } ; bands : intervalles du score final
 *  - skip : règles de saut (AUDIT)
 */

const PHQ_OPTIONS = [
  { label: 'Jamais', value: 0 },
  { label: 'Plusieurs jours', value: 1 },
  { label: 'Plus de la moitié du temps', value: 2 },
  { label: 'Presque tous les jours', value: 3 },
]

const AUDIT_FREQ = [
  { label: 'Jamais', value: 0 },
  { label: 'Moins d’une fois par mois', value: 1 },
  { label: 'Une fois par mois', value: 2 },
  { label: 'Une fois par semaine', value: 3 },
  { label: 'Chaque jour ou presque', value: 4 },
]

const AUDIT_YES_NO = [
  { label: 'Non', value: 0 },
  { label: 'Oui, mais pas dans les douze derniers mois', value: 2 },
  { label: 'Oui, au cours des douze derniers mois', value: 4 },
]

const CONSULT = 'Il peut être utile d’en parler à votre médecin traitant ou à un professionnel de santé mentale.'

export const assessments = [
  {
    slug: 'phq-9',
    shortName: 'PHQ-9',
    title: 'Questionnaire sur la santé du patient (PHQ-9)',
    topic: 'Humeur dépressive',
    icon: 'ph:cloud-rain',
    color: 'blue',
    summary: 'Neuf questions sur les symptômes dépressifs des deux dernières semaines.',
    duration: '2 à 3 min',
    instruction:
      'Au cours des 2 dernières semaines, selon quelle fréquence avez-vous été gêné(e) par les problèmes suivants ?',
    options: PHQ_OPTIONS,
    items: [
      { text: 'Peu d’intérêt ou de plaisir à faire les choses' },
      { text: 'Être triste, déprimé(e) ou désespéré(e)' },
      { text: 'Difficultés à s’endormir ou à rester endormi(e), ou dormir trop' },
      { text: 'Se sentir fatigué(e) ou manquer d’énergie' },
      { text: 'Avoir peu d’appétit ou manger trop' },
      {
        text: 'Avoir une mauvaise opinion de soi-même, ou avoir le sentiment d’être nul(le), ou d’avoir déçu sa famille ou s’être déçu(e) soi-même',
      },
      { text: 'Avoir du mal à se concentrer, par exemple, pour lire le journal ou regarder la télévision' },
      {
        text: 'Bouger ou parler si lentement que les autres auraient pu le remarquer. Ou au contraire, être si agité(e) que vous avez eu du mal à tenir en place par rapport à d’habitude',
      },
      {
        text: 'Penser qu’il vaudrait mieux mourir ou envisager de vous faire du mal d’une manière ou d’une autre',
        support: true, // toute réponse > 0 affiche immédiatement le message d'aide
      },
    ],
    // Question complémentaire, non comptée dans le score
    extra: {
      text: 'Si vous avez coché au moins un des problèmes évoqués, à quel point ce(s) problème(s) a-t-il (ont-ils) rendu votre travail, vos tâches à la maison ou votre capacité à vous entendre avec les autres difficile(s) ?',
      options: [
        { label: 'Pas du tout difficile(s)', value: 0 },
        { label: 'Assez difficile(s)', value: 1 },
        { label: 'Très difficile(s)', value: 2 },
        { label: 'Extrêmement difficile(s)', value: 3 },
      ],
      showIf: (answers) => answers.slice(0, 9).some((v) => v > 0),
    },
    score: { min: 0, max: 27 },
    bands: [
      { min: 0, max: 4, label: 'Symptômes dépressifs minimes ou absents', level: 0 },
      { min: 5, max: 9, label: 'Symptômes dépressifs légers', level: 1 },
      { min: 10, max: 14, label: 'Symptômes dépressifs modérés', level: 2, advice: CONSULT },
      { min: 15, max: 19, label: 'Symptômes dépressifs modérément sévères', level: 3, advice: CONSULT },
      { min: 20, max: 27, label: 'Symptômes dépressifs sévères', level: 3, advice: CONSULT },
    ],
    scoreNote:
      'Score de 0 à 27. Les seuils 5, 10, 15 et 20 correspondent aux niveaux de sévérité définis par les auteurs.',
    source: {
      version: 'PHQ-9, version française pour la France',
      authors:
        'Développé par les Dr Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke et leurs collègues, grâce à une allocation d’études de Pfizer Inc.',
      reference:
        'Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613.',
      licence: 'La reproduction, la traduction, l’affichage ou la distribution de ce document sont autorisés.',
      url: 'https://www.phqscreeners.com/',
    },
  },
  {
    slug: 'gad-7',
    shortName: 'GAD-7',
    title: 'Questionnaire d’anxiété généralisée (GAD-7)',
    topic: 'Anxiété',
    icon: 'ph:wave-sine',
    color: 'purple',
    summary: 'Sept questions sur les symptômes anxieux des deux dernières semaines.',
    duration: '2 min',
    instruction:
      'Au cours des 2 dernières semaines, selon quelle fréquence avez-vous été gêné(e) par les problèmes suivants ?',
    options: PHQ_OPTIONS,
    items: [
      { text: 'Un sentiment de nervosité, d’anxiété ou de tension' },
      { text: 'Une incapacité à arrêter de s’inquiéter ou à contrôler ses inquiétudes' },
      { text: 'Une inquiétude excessive à propos de différentes choses' },
      { text: 'Des difficultés à se détendre' },
      { text: 'Une agitation telle qu’il est difficile à tenir en place' },
      { text: 'Une tendance à être facilement contrarié(e) ou irritable' },
      { text: 'Un sentiment de peur comme si quelque chose de terrible risquait de se produire' },
    ],
    score: { min: 0, max: 21 },
    bands: [
      { min: 0, max: 4, label: 'Symptômes anxieux minimes', level: 0 },
      { min: 5, max: 9, label: 'Symptômes anxieux légers', level: 1 },
      { min: 10, max: 14, label: 'Symptômes anxieux modérés', level: 2, advice: CONSULT },
      { min: 15, max: 21, label: 'Symptômes anxieux sévères', level: 3, advice: CONSULT },
    ],
    scoreNote:
      'Score de 0 à 21. Les seuils 5, 10 et 15 correspondent aux niveaux de sévérité définis par les auteurs ; un score de 10 ou plus justifie une évaluation plus approfondie.',
    source: {
      version: 'GAD-7, version française pour la France',
      authors: 'Développé par les Dr Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke et leurs collègues, grâce à une allocation d’études de Pfizer Inc.',
      reference:
        'Spitzer RL, Kroenke K, Williams JB, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006;166(10):1092-1097.',
      licence: 'La reproduction, la traduction, l’affichage ou la distribution de ce document sont autorisés.',
      url: 'https://www.phqscreeners.com/',
    },
  },
  {
    slug: 'who-5',
    shortName: 'WHO-5',
    title: 'Indice de bien-être de l’OMS (WHO-5)',
    topic: 'Bien-être',
    icon: 'ph:sun',
    color: 'green',
    summary: 'Cinq affirmations sur votre bien-être des deux dernières semaines.',
    duration: '1 min',
    instruction:
      'Veuillez indiquer, pour chacune des cinq affirmations, laquelle se rapproche le plus de ce que vous avez ressenti au cours des deux dernières semaines.',
    options: [
      { label: 'Tout le temps', value: 5 },
      { label: 'La plupart du temps', value: 4 },
      { label: 'Plus de la moitié du temps', value: 3 },
      { label: 'Moins de la moitié du temps', value: 2 },
      { label: 'De temps en temps', value: 1 },
      { label: 'Jamais', value: 0 },
    ],
    items: [
      { text: 'Je me suis senti(e) bien et de bonne humeur' },
      { text: 'Je me suis senti(e) calme et tranquille' },
      { text: 'Je me suis senti(e) plein(e) d’énergie et vigoureux(se)' },
      { text: 'Je me suis réveillé(e) en me sentant frais(che) et dispos(e)' },
      { text: 'Ma vie quotidienne a été remplie de choses intéressantes' },
    ],
    // Score brut 0-25 multiplié par 4 : pourcentage de 0 à 100
    score: { min: 0, max: 100, multiplier: 4, unit: '%' },
    bands: [
      { min: 0, max: 28, label: 'Bien-être très diminué', level: 3, advice: CONSULT },
      { min: 29, max: 50, label: 'Bien-être diminué', level: 2, advice: CONSULT },
      { min: 51, max: 100, label: 'Pas de diminution notable du bien-être', level: 0 },
    ],
    higherIsBetter: true,
    scoreNote:
      'Score brut de 0 à 25, multiplié par 4 pour obtenir un pourcentage (0 = le plus faible bien-être, 100 = le meilleur). Un score de 50 ou moins invite à rechercher une dépression ; un score de 28 ou moins est évocateur d’une dépression probable (Topp et al., 2015).',
    source: {
      version: 'Indice (en cinq points) de bien-être de l’OMS, version française (1998)',
      authors: 'WHO Collaborating Centre in Mental Health, Psychiatric Research Unit, Hillerød (Danemark).',
      reference:
        'Topp CW, Østergaard SD, Søndergaard S, Bech P. The WHO-5 Well-Being Index: a systematic review of the literature. Psychother Psychosom. 2015;84(3):167-176.',
      licence: 'Organisation mondiale de la Santé, licence CC BY-NC-SA 3.0 IGO.',
      url: 'https://www.who.int/publications/m/item/WHO-UCN-MSD-MHE-2024.01',
    },
  },
  {
    slug: 'audit',
    shortName: 'AUDIT',
    title: 'Test d’identification des troubles liés à l’usage de l’alcool (AUDIT)',
    topic: 'Consommation d’alcool',
    icon: 'ph:wine',
    color: 'indigo',
    summary: 'Dix questions de l’OMS sur votre consommation d’alcool.',
    duration: '2 à 3 min',
    instruction: 'Ce questionnaire permet d’évaluer par vous-même votre consommation d’alcool.',
    note: 'Un verre standard correspond à environ 10 g d’alcool pur : par exemple un verre de vin (10 cl), un demi de bière (25 cl) ou une dose de spiritueux (3 cl).',
    options: AUDIT_FREQ,
    items: [
      {
        text: 'À quelle fréquence vous arrive-t-il de consommer des boissons contenant de l’alcool?',
        options: [
          { label: 'Jamais', value: 0 },
          { label: '1 fois par mois ou moins', value: 1 },
          { label: '2 à 4 fois par mois', value: 2 },
          { label: '2 à 3 fois par semaine', value: 3 },
          { label: '4 fois ou plus par semaine', value: 4 },
        ],
      },
      {
        text: 'Combien de verres standards buvez-vous au cours d’une journée ordinaire où vous buvez de l’alcool?',
        options: [
          { label: 'Un ou deux', value: 0 },
          { label: 'Trois ou quatre', value: 1 },
          { label: 'Cinq ou six', value: 2 },
          { label: 'Sept à neuf', value: 3 },
          { label: 'Dix ou plus', value: 4 },
        ],
      },
      { text: 'Au cours d’une même occasion, à quelle fréquence vous arrive-t-il de boire six verres standards ou plus?' },
      {
        text: 'Dans les douze derniers mois, à quelle fréquence avez-vous observé que vous n’étiez plus capable de vous arrêter de boire après avoir commencé?',
      },
      {
        text: 'Dans les douze derniers mois, à quelle fréquence le fait d’avoir bu de l’alcool vous a-t-il empêché de faire ce qu’on attendait normalement de vous?',
      },
      {
        text: 'Dans les douze derniers mois, à quelle fréquence, après une période de forte consommation, avez-vous dû boire de l’alcool dès le matin pour vous remettre en forme?',
      },
      { text: 'Dans les douze derniers mois, à quelle fréquence avez-vous eu un sentiment de culpabilité ou de regret après avoir bu?' },
      {
        text: 'Dans les douze derniers mois, à quelle fréquence avez-vous été incapable de vous souvenir de ce qui s’était passé la nuit précédente parce que vous aviez bu?',
      },
      { text: 'Vous êtes-vous blessé ou avez-vous blessé quelqu’un parce que vous aviez bu?', options: AUDIT_YES_NO },
      {
        text: 'Est-ce qu’un proche, un ami, un médecin ou un autre professionnel de santé s’est déjà préoccupé de votre consommation d’alcool et vous a conseillé de la diminuer?',
        options: AUDIT_YES_NO,
      },
    ],
    // Règles de saut du manuel de l'OMS : les questions sautées comptent 0
    skip: [
      { after: 0, when: (a) => a[0] === 0, goTo: 8 }, // ne boit jamais → questions 9 et 10
      { after: 2, when: (a) => a[1] + a[2] === 0, goTo: 8 }, // questions 2 + 3 = 0 → questions 9 et 10
    ],
    score: { min: 0, max: 40 },
    bands: [
      { min: 0, max: 7, label: 'Zone I : consommation à faible risque', level: 0 },
      { min: 8, max: 15, label: 'Zone II : consommation à risque', level: 2, advice: CONSULT },
      { min: 16, max: 19, label: 'Zone III : consommation nocive', level: 3, advice: CONSULT },
      { min: 20, max: 40, label: 'Zone IV : dépendance possible', level: 3, advice: CONSULT },
    ],
    scoreNote:
      'Score de 0 à 40, interprété selon les zones de risque du manuel de l’OMS. Les seuils varient selon les études : un seuil plus bas est parfois retenu pour les femmes et les personnes de plus de 65 ans.',
    source: {
      version: 'AUDIT, version française validée',
      authors: 'Organisation mondiale de la Santé.',
      reference:
        'Gache P, Michaud P, Landry U, Accietto C, Arfaoui S, Wenger O, Daeppen JB. The Alcohol Use Disorders Identification Test (AUDIT) as a screening tool for excessive drinking in primary care: reliability and validity of a French version. Alcohol Clin Exp Res. 2005;29(11):2001-2007. Babor TF et al. AUDIT, manuel d’utilisation, OMS, 2001.',
      licence: 'Outil de l’OMS, libre de reproduction.',
      url: 'https://www.who.int/publications/i/item/WHO-MSD-MSB-01.6a',
    },
  },
  {
    slug: 'rosenberg',
    shortName: 'RSES',
    title: 'Échelle d’estime de soi de Rosenberg',
    topic: 'Estime de soi',
    icon: 'ph:user-circle',
    color: 'gray',
    summary: 'Dix affirmations sur l’image que vous avez de vous-même.',
    duration: '2 min',
    instruction: 'Pour chacune des caractéristiques ou descriptions suivantes, indiquez à quel point chacune est vraie pour vous.',
    options: [
      { label: 'Tout à fait en désaccord', value: 1 },
      { label: 'Plutôt en désaccord', value: 2 },
      { label: 'Plutôt en accord', value: 3 },
      { label: 'Tout à fait en accord', value: 4 },
    ],
    items: [
      { text: 'Je pense que je suis une personne de valeur, au moins égale à n’importe qui d’autre' },
      { text: 'Je pense que je possède un certain nombre de belles qualités.' },
      { text: 'Tout bien considéré, je suis porté à me considérer comme un raté', reverse: true },
      { text: 'Je suis capable de faire les choses aussi bien que la majorité des gens' },
      { text: 'Je sens peu de raisons d’être fier de moi.', reverse: true },
      { text: 'J’ai une attitude positive vis-à-vis moi-même.' },
      { text: 'Dans l’ensemble, je suis satisfait de moi.' },
      { text: 'J’aimerais avoir plus de respect pour moi-même', reverse: true },
      { text: 'Parfois je me sens vraiment inutile.', reverse: true },
      { text: 'Il m’arrive de penser que je suis un bon à rien.', reverse: true },
    ],
    score: { min: 10, max: 40 },
    bands: [], // pas de seuil validé : le score est présenté sans catégorie
    higherIsBetter: true,
    resultText:
      'Plus le score est élevé, plus l’estime de soi est élevée. Cette échelle n’a pas de seuil officiel : le score sert surtout à suivre votre évolution dans le temps, ou de point de départ pour en parler.',
    scoreNote: 'Score de 10 à 40. Les items 3, 5, 8, 9 et 10 sont cotés à l’envers.',
    source: {
      version: 'Échelle d’estime de soi de Rosenberg, version canadienne-française',
      authors: 'Morris Rosenberg (1965).',
      reference:
        'Vallières EF, Vallerand RJ. Traduction et validation canadienne-française de l’échelle de l’estime de soi de Rosenberg. Int J Psychol. 1990;25(2):305-316.',
      licence: 'Utilisation libre (Morris Rosenberg Foundation).',
      url: 'https://socy.umd.edu/about-us/using-rosenberg-self-esteem-scale',
    },
  },
]

export function getAssessment(slug) {
  return assessments.find((a) => a.slug === slug) || null
}
