/**
 * Ressources d'aide en France.
 * Numéros et horaires vérifiés en octobre 2026 auprès de sources officielles :
 * sante.fr (3114), ameli.fr (Mon soutien psy), Psycom (lignes d'écoute), filsantejeunes.com.
 * À revérifier régulièrement : horaires et dispositifs peuvent changer.
 */
export const VERIFIED = { fr: 'octobre 2026', en: 'October 2026' }

export const helpSections = [
  {
    id: 'emergency',
    icon: 'ph:siren',
    tone: 'red',
    title: { fr: 'En cas d’urgence', en: 'In an emergency' },
    intro: {
      fr: 'Si vous ou un proche êtes en danger, ou avez des idées suicidaires, appelez sans attendre.',
      en: 'If you or someone close to you is in danger or having suicidal thoughts, call right away.',
    },
    items: [
      {
        name: { fr: '3114 – Numéro national de prévention du suicide', en: '3114 – National suicide prevention line' },
        phone: '3114',
        hours: { fr: 'Gratuit, 24 h/24, 7 j/7', en: 'Free, 24/7' },
        description: {
          fr: 'Des infirmiers et psychologues formés répondent aux personnes en détresse, à leurs proches et aux professionnels.',
          en: 'Trained nurses and psychologists answer people in distress, their relatives and professionals.',
        },
        url: 'https://3114.fr/',
      },
      {
        name: { fr: '15 – SAMU', en: '15 – Emergency medical service (SAMU)' },
        phone: '15',
        hours: { fr: 'Gratuit, 24 h/24', en: 'Free, 24/7' },
        description: { fr: 'Urgence médicale, y compris psychiatrique.', en: 'Medical emergencies, including psychiatric ones.' },
      },
      {
        name: { fr: '112 – Numéro d’urgence européen', en: '112 – European emergency number' },
        phone: '112',
        hours: { fr: 'Gratuit, 24 h/24', en: 'Free, 24/7' },
        description: { fr: 'Depuis n’importe quel pays de l’Union européenne.', en: 'From any European Union country.' },
      },
    ],
  },
  {
    id: 'listen',
    icon: 'ph:phone-call',
    tone: 'blue',
    title: { fr: 'Parler à quelqu’un', en: 'Talk to someone' },
    intro: {
      fr: 'Des lignes d’écoute gratuites et anonymes, pour parler de ce que vous vivez.',
      en: 'Free, anonymous listening lines to talk about what you are going through.',
    },
    items: [
      {
        name: { fr: 'SOS Amitié', en: 'SOS Amitié' },
        phone: '09 72 39 40 50',
        hours: {
          fr: '24 h/24, 7 j/7 · tchat tous les jours de 13 h à 3 h · en anglais : 01 46 21 46 46 (15 h-23 h)',
          en: '24/7 in French · chat daily 1 pm-3 am · in English: 01 46 21 46 46 (3 pm-11 pm)',
        },
        description: { fr: 'Écoute bénévole, anonyme, pour toute personne en souffrance.', en: 'Anonymous volunteer listening for anyone who is struggling.' },
        url: 'https://www.sos-amitie.com/',
      },
      {
        name: { fr: 'Croix-Rouge Écoute', en: 'Croix-Rouge Écoute (Red Cross)' },
        phone: '0 800 858 858',
        hours: { fr: 'Gratuit · lundi-vendredi 9 h-19 h, week-end 12 h-18 h', en: 'Free · Mon-Fri 9 am-7 pm, weekends 12-6 pm' },
        description: { fr: 'Soutien psychologique anonyme.', en: 'Anonymous psychological support.' },
      },
      {
        name: { fr: 'Fil Santé Jeunes (12-25 ans)', en: 'Fil Santé Jeunes (ages 12-25)' },
        phone: '0 800 235 236',
        hours: { fr: 'Gratuit, anonyme · tous les jours 9 h-23 h · tchat 9 h-22 h', en: 'Free, anonymous · daily 9 am-11 pm · chat 9 am-10 pm' },
        description: { fr: 'Santé, mal-être, relations : des professionnels répondent aux jeunes.', en: 'Health, distress, relationships: professionals answer young people.' },
        url: 'https://www.filsantejeunes.com/',
      },
      {
        name: { fr: 'Nightline (étudiants)', en: 'Nightline (students)' },
        phone: '0 809 104 104',
        hours: { fr: 'Gratuit · tous les soirs 21 h-2 h 30 · en anglais : 0 809 104 105', en: 'Free · every evening 9 pm-2:30 am · in English: 0 809 104 105' },
        description: { fr: 'Écoute par des étudiants formés, pour les étudiants.', en: 'Listening by trained students, for students.' },
      },
    ],
  },
  {
    id: 'care',
    icon: 'ph:stethoscope',
    tone: 'green',
    title: { fr: 'Consulter', en: 'Getting care' },
    intro: {
      fr: 'Pour être accompagné dans la durée, plusieurs portes d’entrée existent.',
      en: 'Several entry points exist for longer-term support.',
    },
    items: [
      {
        name: { fr: 'Votre médecin traitant', en: 'Your GP' },
        description: {
          fr: 'C’est souvent le premier interlocuteur : il peut évaluer la situation, proposer un traitement et orienter vers un psychologue ou un psychiatre.',
          en: 'Often the first person to see: they can assess the situation, suggest treatment and refer you to a psychologist or psychiatrist.',
        },
      },
      {
        name: { fr: 'Mon soutien psy', en: 'Mon soutien psy (reimbursed psychologist sessions)' },
        hours: { fr: 'Dès 3 ans · jusqu’à 12 séances par an', en: 'From age 3 · up to 12 sessions per year' },
        description: {
          fr: 'Séances chez un psychologue partenaire, remboursées par l’Assurance Maladie (60 %, le reste par la complémentaire), avec ou sans courrier du médecin, pour une souffrance psychique légère à modérée.',
          en: 'Sessions with a partner psychologist, reimbursed by French health insurance (60%, the rest by top-up insurance), with or without a doctor’s letter, for mild to moderate psychological distress.',
        },
        url: 'https://monsoutienpsy.ameli.fr/recherche-psychologue',
      },
      {
        name: { fr: 'Centre médico-psychologique (CMP)', en: 'Community mental health centre (CMP)' },
        description: {
          fr: 'Consultations publiques et sans frais (psychiatres, psychologues, infirmiers), rattachées à l’hôpital de votre secteur.',
          en: 'Free public consultations (psychiatrists, psychologists, nurses), linked to your local hospital.',
        },
        url: 'https://www.psycom.org/sorienter/les-annuaires-locaux/',
      },
    ],
  },
  {
    id: 'info',
    icon: 'ph:info',
    tone: 'gray',
    title: { fr: 'S’informer', en: 'Information' },
    intro: { fr: 'Des sources fiables sur la santé mentale.', en: 'Reliable sources on mental health.' },
    items: [
      {
        name: { fr: 'Psycom', en: 'Psycom' },
        description: {
          fr: 'Organisme public d’information sur la santé mentale : troubles, traitements, lignes d’écoute et annuaires locaux.',
          en: 'French public body providing mental health information: disorders, treatments, helplines and local directories.',
        },
        url: 'https://www.psycom.org/',
      },
      {
        name: { fr: 'Unafam', en: 'Unafam' },
        description: {
          fr: 'Association qui accompagne les proches de personnes vivant avec des troubles psychiques.',
          en: 'Association supporting relatives of people living with mental health conditions.',
        },
        url: 'https://www.unafam.org/',
      },
    ],
  },
]
