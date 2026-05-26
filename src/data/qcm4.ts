// src/data/qcm4.ts

export type AnswerKey = 'A' | 'B' | 'C' | 'D' | 'E';

export type Question = {
  id: number;
  question: string;
  answers: Partial<Record<AnswerKey, string>>;
  correctAnswers: AnswerKey[];
};

export const qcm4: Question[] = [
  // THEME : CONNAISSANCE DU MILIEU
  {
    id: 1,
    question: "Il est possible de se baigner dans les plans d'eau",
    answers: {
      A: 'Qui sont autorisés par le Maire',
      B: "Où il n'y a pas de panneau baignade interdite",
      C: "Seulement s'il y a un poste de secours",
      D: "Seulement s'il y a des sauveteurs",
    },
    correctAnswers: ['A', 'B'],
  },

  {
    id: 2,
    question: "Une baignade est surveillée dès lors qu'il y a",
    answers: {
      A: 'Un poste de secours',
      B: 'Un drapeau vert sur le mat du poste de secours',
      C: 'Des sauveteurs sur la plage',
      D: 'Une signalisation en place',
    },
    correctAnswers: ['B', 'C', 'D'],
  },

  {
    id: 3,
    question: "Sur une plage, ou il n'y a pas de poste de secours",
    answers: {
      A: "La baignade n'est pas autorisée",
      B: "La baignade est aux risques et périls des usagers",
      C: "La baignade est autorisée mais il n'y a pas de surveillance",
    },
    correctAnswers: ['B', 'C'],
  },

  {
    id: 4,
    question: 'Une baïne :',
    answers: {
      A: "Représente l'amplitude de la mer",
      B: "Est une sorte de cuvette remplie d'eau",
      C: 'Peut être dangereuse pour la baignade',
    },
    correctAnswers: ['B', 'C'],
  },

  {
    id: 5,
    question: "Se baigner dans une eau de piscine polluée",
    answers: {
      A: 'Peut générer des conjonctivites',
      B: 'Peut provoquer des affections cutanées',
      C: 'Peut provoquer des diarrhées',
    },
    correctAnswers: ['A', 'B', 'C'],
  },

  {
    id: 6,
    question: 'Les bouées coniques jaunes servent à baliser :',
    answers: {
      A: 'Un chenal traversier',
      B: 'La limite des 300m',
      C: 'La limite la zone de baignade',
      D: 'Le côté gauche d\'un chenal traversier lorsque je regarde de la plage',
    },
    correctAnswers: ['A', 'C'],
  },

  {
    id: 7,
    question: "Le drapeau jaune peut être hissé lorsque la température de l'eau est trop froide",
    answers: {
      A: 'Vrai',
      B: "Faux, la température n'intervient pas dans le choix de la flamme",
      C: "Faux, c'est le drapeau rouge qui doit être hissée",
      D: "Faux, c'est l'échelle de Beaufort qui détermine la couleur du drapeau",
    },
    correctAnswers: ['A'],
  },

  {
    id: 8,
    question: "En milieu naturel, avec un vent fort venant de la terre, un cône orange peut être hissé",
    answers: {
      A: 'Car des pneumatiques peuvent être emportés vers le large',
      B: 'Car cela nécessite une vigilance particulière',
      C: 'A la place du cône orange, on peut hisser un drapeau Rouge et Blanc',
      D: 'On le hisse dès que la force du vent atteint 2 beauforts',
    },
    correctAnswers: ['A', 'B', 'C'],
  },

  {
    id: 9,
    question: "Les dangers en Atlantique liés aux marées, sont à prendre au sérieux",
    answers: {
      A: 'Surtout en présence de Baïnes',
      B: 'En marée montante uniquement',
      C: "Lors des grandes marées d'équinoxes",
    },
    correctAnswers: ['A', 'C'],
  },

  {
    id: 10,
    question: "Il existe dans la réglementation française plusieurs catégories de baignade",
    answers: {
      A: "Les emplacements dangereux ou il est interdit de se baigner",
      B: "Les emplacements ou le public se baigne à ces risques et périls",
      C: "Les emplacements aménagés qui font l'objet de dispositions particulières",
    },
    correctAnswers: ['A', 'B', 'C'],
  },

  {
    id: 11,
    question: "Une baignade en eaux libre et d'accès payant",
    answers: {
      A: 'Doit disposer d\'un POSS',
      B: "Doit afficher les analyses d'eau",
      C: 'Est surveillée que par des MNS',
    },
    correctAnswers: ['A', 'B'],
  },

  {
    id: 12,
    question: "Une zone de bain en milieu naturel doit est balisée avec",
    answers: {
      A: 'Des bouées sphériques jaunes',
      B: 'Des bouées cylindriques jaunes',
      C: 'Obligatoirement avec des bouées rouges',
    },
    correctAnswers: ['A'],
  },

  {
    id: 13,
    question: "Une zone de baignade surveillée en fonds instables",
    answers: {
      A: "Est balisée par des piquets avec un drapeau rouge/jaune",
      B: "N'a pas de limite qui détermine la zone de surveillance",
      C: "Est toujours limitée à 300m à droite et à gauche du poste de secours",
      D: "Peut-être amovible en fonction de l'état de la mer",
    },
    correctAnswers: ['A', 'D'],
  },

  {
    id: 14,
    question: "Dès que l'on détecte des méduses, la fermeture de la baignade est obligatoire",
    answers: {
      A: "Oui, c'est un vrai danger pour les baigneurs",
      B: "Oui, les brûlures risquent de provoquer des crampes qui finissent en noyade",
      C: "Non, les méduses sont régulièrement présentes dans la mer",
      D: 'Un drapeau violet peut signaler leurs présences',
    },
    correctAnswers: ['C', 'D'],
  },

  // THEME : DIPLÔMES COMPETENCES OBLIGATIONS
  {
    id: 15,
    question: "Pour exercer sur un lieu d'accès payant, un BNSSA doit être déclaré en préfecture",
    answers: {
      A: 'Pour travailler seul',
      B: "Pour travailler en présence d'un MNS",
      C: 'Le préfet lui délivre un récépissé de déclaration',
      D: "N'a pas de déclaration à faire, seuls les MNS doivent se déclarer",
    },
    correctAnswers: ['A', 'B', 'C'],
  },

  {
    id: 16,
    question: "Un surveillant de baignade pour Accueil Collectif de Mineurs",
    answers: {
      A: "Peux exercer en piscine toute l'année avec une dérogation du préfet",
      B: "Peut exercer en piscine uniquement l'été avec une dérogation du préfet",
      C: 'Exerce uniquement en centre de vacances',
    },
    correctAnswers: ['A'],
  },

  {
    id: 17,
    question: "Un BNSSA qui travaille dans une piscine publique, peut exercer en surveillance",
    answers: {
      A: "Entre 1 mois minimum et 4 mois maximum avec dérogation",
      B: 'Toute l\'année sans dérogation',
      C: "Uniquement s'il a réussi un concours dans la fonction publique",
    },
    correctAnswers: ['A'],
  },

  {
    id: 18,
    question: "Une autorisation spéciale peut être délivrée par le préfet",
    answers: {
      A: "Pour pouvoir exercer dans un lieu d'accès payant sans la présence d'un MNS",
      B: 'Pour être autorisé à faire des cours de natation',
      C: "Dans le temps appelé « dérogation », pour exercer en autonomie, elle n'existe plus",
    },
    correctAnswers: ['A'],
  },

  {
    id: 19,
    question: "Parmi ces obligations, lesquelles sont obligatoires pour exercer en piscine publique",
    answers: {
      A: 'Etre titulaire du certificat de compétence PSE 2',
      B: 'le récépissé de déclaration de la préfecture',
      C: "le certificat de vaccination pour l'hépatite B",
      D: 'la formation continue en secourisme doit être à jour',
    },
    correctAnswers: ['B', 'D'],
  },

  {
    id: 20,
    question: "Un BNSSA peut piloter un bateau à moteur mis à disposition au poste de secours",
    answers: {
      A: "Sans permis, quelle que soit la puissance du moteur s'il ne dépasse pas 5 nœuds",
      B: "Sans permis, quelle que soit la puissance du moteur, car c'est un engin de secours",
      D: 'Uniquement avec un permis',
    },
    correctAnswers: ['A'],
  },

  // THEME : ORGANISATION ADMINISTRATIVE
  {
    id: 21,
    question: "La demande d'analyse bactériologique d'une baignade est ordonnée",
    answers: {
      A: "Par l'exploitant d'une piscine",
      B: 'Par un laboratoire agréé',
      C: "Par l'Agence Régionale de la Santé",
      D: 'Par le maire responsable d\'une zone de baignade',
    },
    correctAnswers: ['A', 'C', 'D'],
  },

  {
    id: 22,
    question: "Lorsqu'une baignade en milieu naturel est ouverte, les analyses de l'eau sont faites",
    answers: {
      A: 'A la convenance du Maire',
      B: 'Obligatoirement tous les 15 jours',
      C: 'Obligatoirement une fois tous les mois',
      D: "Uniquement en cas d'aspect inquiétant de l'eau",
    },
    correctAnswers: ['B'],
  },

  {
    id: 23,
    question: "Les droits d'accès aux baignades en milieu naturel sont régis",
    answers: {
      A: 'Par le Préfet',
      B: "Par le Directeur de l'agence régionale de l'eau",
      C: 'Par le Maire',
      D: "Le Président d'une communauté de communes",
    },
    correctAnswers: ['C'],
  },

  {
    id: 24,
    question: "Le Préfet peut prendre la décision d'interdire une baignade",
    answers: {
      A: "Lorsque le Maire ne respecte pas ses obligations",
      B: "Lorsqu'un conflit politique oppose le Maire et le Préfet",
      C: 'Non car seul le Maire est responsable devant la justice',
      D: 'Sur avis de la DDCSPP',
    },
    correctAnswers: ['A', 'D'],
  },

  {
    id: 25,
    question: "Un gérant de camping souhaite ouvrir une baignade surveillée au bord d'un lac.",
    answers: {
      A: "Il doit effectuer une demande d'ouverture de la baignade adressée au Maire",
      B: "Il doit adresser une déclaration d'ouverture de la baignade adressée au Préfet",
      C: 'Il doit se conformer à une visite des pompiers',
      D: 'Il doit installer un poste de secours',
    },
    correctAnswers: ['A', 'D'],
  },

  {
    id: 26,
    question: "La réglementation des piscines de camping oblige à une surveillance",
    answers: {
      A: 'Toute l\'année',
      B: 'Toute la période estivale',
      C: "Le gérant doit uniquement informer ces clients de l'absence de surveillance",
    },
    correctAnswers: ['B'],
  },

  {
    id: 27,
    question: "Même sans obligation de surveillance un gérant de camping peut être",
    answers: {
      A: 'Condamné pour un défaut de moyen',
      B: "Condamné pour un manquement à une obligation de sécurité",
      C: "Condamné pour un manquement à une obligation d'information",
      D: "Jamais condamné car le client se baigne à ces risques et périls",
    },
    correctAnswers: ['A', 'B', 'C'],
  },

  {
    id: 28,
    question: "En piscine un suivi sanitaire journalier doit être",
    answers: {
      A: 'Assuré par le personnel en place',
      B: 'Effectué pour vérifier la teneur en chlore',
      C: 'Effectué pour vérifier la teneur en PH',
      D: 'Assuré pour mesurer le taux de bactéries pathogènes',
    },
    correctAnswers: ['A', 'B', 'C'],
  },

  {
    id: 29,
    question: "En cas de noyade, au-delà de leur zone de surveillance, les sauveteurs",
    answers: {
      A: "Ne doivent pas intervenir car ils quittent leur zone de surveillance",
      B: "Doivent intervenir et mettant en œuvre les moyens dont ils disposent",
      C: 'Doivent prévenir le Maire avant de porter secours',
      D: 'Doivent prévenir le CROSS avant de porter secours',
    },
    correctAnswers: ['B'],
  },

  // THEME : L'ORGANISATION DE LA SECURITE
  {
    id: 30,
    question: "Le POSS est obligatoire",
    answers: {
      A: 'Dans tous les lieux de baignade',
      B: 'Dans les piscines uniquement',
      C: "Uniquement dans les lieux d'accès payant",
      D: "Uniquement lorsqu'il y a un maître-nageur sauveteur",
    },
    correctAnswers: ['C'],
  },

  {
    id: 31,
    question: "Quels sont les éléments obligatoires dans le POSS",
    answers: {
      A: 'Un plan détaillé du lieu indiquant les moyens de secours sur place',
      B: "Les numéros de téléphone indispensables pour l'appel des secours",
      C: "Les analyses bactériologiques de l'eau",
      D: "Les protocoles d'intervention",
      E: "Les horaires d'ouverture",
    },
    correctAnswers: ['A', 'B', 'D'],
  },

  // THEME : LA SURVEILLANCE ET SECURITE DES ACTIVITES SPECIFIQUES
  {
    id: 32,
    question: "Un scooter des mers peut être utilisé dans la bande des 300m",
    answers: {
      A: "Uniquement à vitesse de 5 nœuds pour sortir de la bande des 300m",
      B: "A pleine vitesse dès lors qu'il ne s'agit pas d'une zone de baignade",
      C: "Non, leur utilisation est strictement interdite",
    },
    correctAnswers: ['A'],
  },

  {
    id: 33,
    question: "Le surf et le Body-Board se pratiquent",
    answers: {
      A: 'Uniquement dans la zone de baignade',
      B: 'Uniquement hors de la zone de baignade',
      C: 'Dans une zone délimitée par un drapeau à damier noir et blanc',
    },
    correctAnswers: ['C'],
  },

  {
    id: 34,
    question: "La planche à voile peut se pratiquer",
    answers: {
      A: 'Dans la bande des 300m',
      B: 'Dans la zone de baignade surveillée',
      C: 'Uniquement en dehors de la zone de baignade',
      D: 'Uniquement en dehors de la bande des 300m',
    },
    correctAnswers: ['C'],
  },

  {
    id: 35,
    question: "Un kayak de mer",
    answers: {
      A: "Ne peut évoluer qu'en présence d'une embarcation",
      B: 'Doit être de structure rigide pour évoluer au delà des 300m',
      C: 'Doit disposer d\'un dispositif permettant le remorquage',
    },
    correctAnswers: ['C'],
  },

  {
    id: 36,
    question: "Les bateaux gonflables et les matelas pneumatiques sont",
    answers: {
      A: 'Uniquement utilisés dans la bande des 300m',
      B: "Ne sont pas considérés comme des engins de plages",
      C: 'Doivent être utilisés dans le chenal traversier',
      D: "Sont utilisables jusqu'à 1 mille des côtes",
    },
    correctAnswers: ['A'],
  },

  // THEME : CONDUITE A TENIR EN CAS D'ACCIDENT, PREMIERS SOINS
  {
    id: 37,
    question: "Lors d'un accident de plongée",
    answers: {
      A: 'Une des raisons peut être une remontée trop rapide',
      B: "Les paramètres de durée et de profondeur ne rentrent pas en ligne de compte",
      C: "Il est utile de préciser le nombre de plongeurs dans la palanquée",
      D: "L'administration d'oxygène est déconseillée",
    },
    correctAnswers: ['A', 'C'],
  },

  {
    id: 38,
    question: "Les stades de la noyade",
    answers: {
      A: 'Permettent de simplifier la communication entre les sauveteurs',
      B: 'Sont au nombre de cinq tableaux cliniques',
      C: 'Lorsque vous êtes en présence d\'un stade 2, la victime est inconsciente',
      D: 'Des difficultés respiratoires avec une inconscience caractérisent le stade 3',
    },
    correctAnswers: ['A', 'B', 'D'],
  },

  {
    id: 39,
    question: "Lors d'un trauma du rachis survenant dans l'eau en piscine",
    answers: {
      A: "Il vaut mieux extraire la victime rapidement, et ce même si elle est consciente",
      B: "Il vaut mieux stabiliser la victime dans l'eau en attendant les secours",
      C: "Un des facteurs aggravants peut être l'hypothermie",
      D: "Il est possible de procéder à deux sauveteurs à une extraction sur planche dorsale",
    },
    correctAnswers: ['B', 'C', 'D'],
  },

  {
    id: 40,
    question: "Une hypersensibilité due à l'eau",
    answers: {
      A: "Pour les personnes à risque peut provenir directement au contact de l'eau",
      B: "Pour les personnes à risque ne peut provenir qu'au bout d'un certain temps de baignade",
      C: 'Peut entraîner des difficultés respiratoires',
      D: "Réduire la durée du bain peut en limiter le risque",
    },
    correctAnswers: ['A', 'C', 'D'],
  },
];