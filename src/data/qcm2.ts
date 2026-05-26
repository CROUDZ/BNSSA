// src/data/qcm2.ts

export type AnswerKey = "A" | "B" | "C" | "D";

export type Question = {
  id: number;
  question: string;
  answers: Partial<Record<AnswerKey, string>>;
  correctAnswers: AnswerKey[];
};

export const qcm2: Question[] = [
  // THEME : CONNAISSANCE DU MILIEU
  {
    id: 1,
    question: "En milieu naturel",
    answers: {
      A: "Avec un drapeau jaune hissée, j'interdis la baignade",
      B: "Avec un drapeau rouge hissée, j'interdis la baignade",
      C: "Sur l'échelle de beaufort qui indique F6, je hisse le drapeau vert",
    },
    correctAnswers: ["B"],
  },

  {
    id: 2,
    question: "Les analyses de qualité de l'eau en piscine",
    answers: {
      A: "Sont confidentielles et ne doivent pas être vues du public",
      B: "Doivent être affichées et visibles par le public",
      C: "Sont réalisées au moins 4 fois par mois par l'ARS",
    },
    correctAnswers: ["B"],
  },

  {
    id: 3,
    question: "La météo marine annonce Force 10 sur l'Echelle de Beaufort",
    answers: {
      A: "C'est une tempête",
      B: "C'est un coup de vent",
      C: "Je dois fermer la baignade",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 4,
    question: "Une piqûre de vive",
    answers: {
      A: "Peut provoquer une violente douleur",
      B: "Peut occasionner des nécroses de la peau",
      C: "Est provoquée par un animal de la classe des physalies",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 5,
    question: "l'ARS",
    answers: {
      A: "Est l'Agence Régionale de Sécurité",
      B: "Est l'Agence Régionale de Santé",
      C: "Assure uniquement le contrôle de la qualité de l'eau des piscines",
    },
    correctAnswers: ["B"],
  },

  {
    id: 6,
    question: "Les analyses d'eau en piscine effectuées par le personnel",
    answers: {
      A: "Peuvent être réalisées par un BNSSA",
      B: "Sont obligatoires 1 fois par mois",
      C: "Doivent être effectuées au moins deux fois par jour",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 7,
    question: 'En mer les "bâches"',
    answers: {
      A: "Se trouvent principalement sur les côtes de la Manche",
      B: "Sont toujours en Méditerranée",
      C: "Ne sont absolument pas dangereuses",
    },
    correctAnswers: ["A"],
  },

  {
    id: 8,
    question: "L'Echelle de Beaufort est",
    answers: {
      A: "Une grille de notation des sauveteurs en fin de saison",
      B: "Une grille qui indique la force du vent et les effets sur l'état de la mer",
      C: "Internationale et permet à tous les marins de la comprendre",
    },
    correctAnswers: ["B", "C"],
  },

  // THEME : DIPLÔMES COMPETENCES OBLIGATIONS
  {
    id: 9,
    question: "Un BNSSA",
    answers: {
      A: "Doit suivre une formation continue pour réactualiser son BNSSA tous les 5 ans",
      B: "Doit suivre une formation continue en secourisme tous les ans",
      C: "Peut conserver une activité sans satisfaire à aucune formation continue",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 10,
    question: "Dans un club de natation sportive",
    answers: {
      A: "Un BNSSA peut assurer la surveillance des usagers",
      B: "Un BNSSA peut encadrer les activités et assurer certains cours en étant salarié",
      C: "Un MNS peut assurer l'enseignement de la natation",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 11,
    question: "Avec le BNSSA je peux",
    answers: {
      A: "Encadrer contre rémunération des élèves en club et enseigner la natation",
      B: "Assurer des cours d'aquagym",
      C: "Surveiller contre rémunération des enfants en accueil collectif de mineurs",
    },
    correctAnswers: ["C"],
  },

  {
    id: 12,
    question:
      "Un Surveillant de Baignade pour accueil collectif de mineurs peut",
    answers: {
      A: "Travailler seul dans une piscine municipale avec une dérogation préfectorale",
      B: "Surveiller uniquement les lieux d'accès gratuits",
      C: "Peut surveiller un accueil collectif de mineurs",
    },
    correctAnswers: ["C"],
  },

  {
    id: 13,
    question: "J'ai 16 ans",
    answers: {
      A: "Je peux passer le permis mer option côtier",
      B: "Je peux passer le permis plaisance en eaux intérieures",
      C: "Je dois attendre d'avoir 18 ans pour passer l'un de ces deux permis",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 14,
    question:
      "Un BNSSA peut-il surveiller en autonomie une baignade d'accès payant ?",
    answers: {
      A: "Non en aucun cas",
      B: "Oui à condition d'avoir plus de deux ans d'ancienneté",
      C: "Oui depuis la parution d'un décret en juin 2023",
    },
    correctAnswers: ["C"],
  },

  {
    id: 15,
    question: "Un BNSSA peut encadrer une séance de natation scolaire",
    answers: {
      A: "En étant rémunéré pour cette action",
      B: "En étant bénévole pour cette action",
      C: "En remplacement d'un MNS",
    },
    correctAnswers: ["B"],
  },

  {
    id: 16,
    question: "L'obtention du BNSSA est un prérequis pour",
    answers: {
      A: "Se présenter à une sélection pour devenir MNS",
      B: "Valider l'unité d'enseignement de Surveillant Sauveteur Aquatique en Littoral",
      C: "Porter un tee-shirt de MNS",
    },
    correctAnswers: ["A", "B"],
  },

  // THEME : LE CONTEXTE JURIDIQUE
  {
    id: 17,
    question:
      "Les textes réglementaires s'établissent dans cet ordre hiérarchique",
    answers: {
      A: "Lois, décrets, arrêtés, circulaires",
      B: "Lois, arrêtés, décrets, circulaires",
      C: "Circulaires, arrêtés, décrets, lois",
    },
    correctAnswers: ["A"],
  },

  {
    id: 18,
    question: "Un second jugement est instruit",
    answers: {
      A: "Par une cour de cassation",
      B: "Par une cour d'appel",
      C: "Par le conseil d'état",
    },
    correctAnswers: ["B"],
  },

  {
    id: 19,
    question:
      "Suite à une noyade dans un lieu surveillé, la responsabilité civile et pénale d'un BNSSA",
    answers: {
      A: "Peut être engagée",
      B: "Ne peut jamais être engagée",
      C: "Si un MNS était présent, lui seul doit répondre de l'accident",
    },
    correctAnswers: ["A"],
  },

  {
    id: 20,
    question: "Le port d'un tee-shirt de Maitre-Nageur Sauveteur par un BNSSA",
    answers: {
      A: "Est autorisé",
      B: "Peut se voir qualifié d'usurpation de titre",
      C: "Expose son contrevenant à 15 000 € d'amende et 1 an d'emprisonnement",
    },
    correctAnswers: ["B"],
  },

  {
    id: 21,
    question: "La responsabilité des maires",
    answers: {
      A: "Le maire dispose d'un pouvoir de police spécial en matière de baignades",
      B: "En cas de carence du maire, l'autorité de substitution est le préfet",
      C: "Le Maire peut être inquiété même pour une noyade hors zone surveillée",
    },
    correctAnswers: ["A", "B", "C"],
  },

  {
    id: 22,
    question: "Une assurance en responsabilité civile professionnelle",
    answers: {
      A: "Permet de dédommager une victime, ou ses proches lors d'une condamnation civile",
      B: "Permet de dédommager une victime, ou ses proches lors d'une condamnation pénale",
      C: "Est la même assurance que la responsabilité civile personnelle",
    },
    correctAnswers: ["A"],
  },

  // THEME : ORGANISATION DE LA SECURITE
  {
    id: 23,
    question: "Un SB",
    answers: {
      A: "Peut organiser une baignade pour mineurs près d'une plage surveillée, s'il est autorisé",
      B: "Peut organiser une baignade pour mineurs sur une plage non surveillée",
      C: "Ne peut assurer la surveillance de mineurs qu'en assistance d'un MNS",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 24,
    question: "Les sauveteurs abaissent le drapeau",
    answers: {
      A: "Quand une intervention importante le nécessite",
      B: "En fin de surveillance à la fermeture du poste de secours",
      C: "Quand la mer est dangereuse",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 25,
    question: "Dans une piscine d'accès payant, ouverte au public",
    answers: {
      A: "Le POSS est obligatoire",
      B: "Le POSS est un document interne et ne doit pas être affiché",
      C: "Le POSS n'est pas obligatoire mais recommandé",
    },
    correctAnswers: ["A"],
  },

  {
    id: 26,
    question: "La surveillance est plus efficace lorsque",
    answers: {
      A: "Les surveillants sont côte à côte",
      B: "Les surveillants sont positionnés sur des chaises hautes uniquement",
      C: "Les surveillants sont positionnés alternativement sur une chaise haute et en déplacement",
    },
    correctAnswers: ["C"],
  },

  {
    id: 27,
    question:
      "Dans le code du sport, « surveillance constante et exclusive » sous-entend,",
    answers: {
      A: "Que le MNS peut enseigner et surveiller en même temps",
      B: "Que le BNSSA peut se distraire durant la surveillance avec un smartphone",
      C: "Que le non-respect des règles de sécurité peut conduire à une lourde condamnation",
    },
    correctAnswers: ["C"],
  },

  {
    id: 28,
    question: "Le règlement intérieur d'une piscine ouverte au public",
    answers: {
      A: "Edicte des règles que les utilisateurs doivent respecter",
      B: "Le MNS est le seul garant pour le faire respecter",
      C: "Comporte des sanctions en cas de non-respect",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 29,
    question: "L'arrêté municipal des plages surveillées",
    answers: {
      A: "Est pris par le Maire",
      B: "Est pris par le préfet",
      C: "Les surveillants sauveteurs se doivent de le faire respecter",
    },
    correctAnswers: ["A", "C"],
  },

  // THEME : SURVEILLANCE ET SECURITE DES ACTIVITES SPECIFIQUES
  {
    id: 30,
    question:
      "Une piscine privée et réservée aux enfants d'un Accueil Collectif de Mineurs",
    answers: {
      A: "Peut être surveillée par un SB",
      B: "Peut être surveillée par un BNSSA",
      C: "Doit obligatoirement être surveillée par un MNS",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 31,
    question:
      "Une piscine de camping ouverte uniquement à ces résidents nécessite",
    answers: {
      A: "Systématiquement une surveillance",
      B: "L'information au public de l'absence de surveillance",
      C: "La présence d'un appareil d'oxygénothérapie",
    },
    correctAnswers: ["B"],
  },

  {
    id: 32,
    question:
      "L'obligation faite aux ERP « établissements recevant du public » de s'équiper d'un Défibrillateur",
    answers: {
      A: "Ne concerne pas les campings",
      B: "Concerne tous les campings",
      C: "Ne concerne que les campings avec une piscine",
    },
    correctAnswers: ["B"],
  },

  {
    id: 33,
    question: "Pour une association type 1901",
    answers: {
      A: "Le responsable de la sécurité des membres est le président",
      B: "Un BNSSA peut être salarié pour assurer la surveillance des membres",
      C: "Un BNSSA peut animer des activités sportives en étant salarié",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 34,
    question: "La surveillance de la natation scolaire par un BNSSA",
    answers: {
      A: "N'est pas possible",
      B: "Peux se faire en autonomie alors que le MNS enseigne",
      C: "Un BNSSA peux bénévolement être agréé pour encadrer la natation scolaire",
    },
    correctAnswers: ["B", "C"],
  },

  {
    id: 35,
    question: "L'enseignement de l'aquagym contre rémunération",
    answers: {
      A: "Peut se faire par BNSSA qui dispose d'un diplôme fédéral d'aquagym",
      B: "Peut se faire en autonomie si le BNSSA dispose du TPF «coach fitness dans l'eau »",
      C: "L'encadrement de séances collectives d'animation en aquafitness doit se dérouler dans un bassin d'une profondeur maximale de 1,30 m et sous la surveillance d'un BNSSA ou d'un MNS.",
    },
    correctAnswers: ["C"],
  },

  {
    id: 36,
    question: "Les activités de plongée subaquatique",
    answers: {
      A: "Sont réglementées par le code du sport",
      B: "L'enseignement bénévole ou rémunéré doit être assuré par un moniteur breveté",
      C: "Un directeur de plongée doit organiser l'activité et coordonner les secours",
    },
    correctAnswers: ["A", "B", "C"],
  },

  // THEME : CONDUITE A TENIR EN CAS D'ACCIDENT, PREMIERS SOINS
  {
    id: 37,
    question:
      "Dans le cas d'un enfant en arrêt cardio-respiratoire, suite à une noyade",
    answers: {
      A: "Il faudra commencer immédiatement par faire 5 insufflations",
      B: "Il faudra commencer immédiatement par faire le massage cardiaque",
      C: "Il faudra masser au moins à 100 compressions à la minute",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 38,
    question:
      "Pour un adulte en détresse vitale, SpO2 < à 94%, il faudra utiliser lors d'une noyade",
    answers: {
      A: "Un masque haute concentration + débit initial à 15l/mn",
      B: "Utilisation masque moyenne concentration + débit initial à 15l/mn",
      C: "Utilisation lunette à O2 + débit initial à 15l/mn",
    },
    correctAnswers: ["A"],
  },

  {
    id: 39,
    question: "Un Stade 3 est caractérisé par une victime",
    answers: {
      A: "Consciente et fatiguée",
      B: "Consciente avec des signes de détresse respiratoire",
      C: "Inconsciente avec des signes de détresse respiratoires",
    },
    correctAnswers: ["C"],
  },

  {
    id: 40,
    question: "Le chlore utilisé en piscine pour le traitement de l'eau",
    answers: {
      A: "Peut s'avérer très toxique",
      B: "Peut être conditionné sous forme liquide, solide ou gazeuse",
      C: "A des propriétés spécifiques pour ne pas brûler au contact avec la peau",
    },
    correctAnswers: ["A", "B"],
  },
];
