// src/data/qcm1.ts

export type AnswerKey = "A" | "B" | "C" | "D";

export type Question = {
  id: number;
  question: string;
  answers: Partial<Record<AnswerKey, string>>;
  correctAnswers: AnswerKey[];
};

export const qcm1: Question[] = [
  // THEME : CONNAISSANCE DU MILIEU
  {
    id: 1,
    question: "Choix du drapeau",
    answers: {
      A: "Pour un vent de force 4 à 5, il est recommandé de mettre le drapeau jaune",
      B: "En cas de brume intense ne permettant pas la surveillance, il faut mettre le drapeau vert",
      C: "Pour un vent de force inférieur à 3, il est recommandé de mettre le drapeau vert",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 2,
    question: "Les analyses d'eau",
    answers: {
      A: "Peuvent entraîner la fermeture d'une baignade si elles sont mauvaises",
      B: "Sont effectuées sous contrôle de l'ARS",
      C: "Sont uniquement réalisées en piscine",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 3,
    question: "L'affichage météo au poste de secours comprend entre autres",
    answers: {
      A: "Les observations météorologiques du jour",
      B: "La durée d'ensoleillement du jour",
      C: "Les heures de marées et coefficients du jour",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 4,
    question: "Les chenaux traversiers (lorsque l'on vient du large)",
    answers: {
      A: "Sont matérialisés par des bouées cylindriques à Bâbord et des bouées coniques à Tribord",
      B: "Les bouées Bâbord sont de couleur verte et les Tribord de couleur rouge",
      C: "Peuvent être autorisés à la baignade",
      D: "Ne font pas l'objet d'une surveillance spécifique",
    },
    correctAnswers: ["A", "D"],
  },

  {
    id: 5,
    question: "L'Echelle de Beaufort est",
    answers: {
      A: "Une grille de lecture qui indique la force du vent et l'état de la mer",
      B: "Une échelle de valeur qui informe de la hauteur des marées",
      C: "Un indicateur dans le choix du drapeau à hisser",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 6,
    question: "L'échelle de Beaufort va pour la force du vent",
    answers: {
      A: "0 à 9",
      B: "0 à 12",
      C: "0 à 15",
    },
    correctAnswers: ["B"],
  },

  {
    id: 7,
    question: "Une Baïne",
    answers: {
      A: "Représente l'amplitude de la mer",
      B: "Est une sorte de cuvette remplie d'eau",
      C: "Peut être dangereuse pour la baignade",
    },
    correctAnswers: ["B", "C"],
  },

  // THEME : DIPLÔMES COMPETENCES OBLIGATIONS
  {
    id: 8,
    question: "Un BNSSA peut surveiller « seul » sans dérogation préfectorale",
    answers: {
      A: "Un plan d'eau d'accès gratuit",
      B: "Une piscine d'accès payant",
      C: "Un Accueil Collectif de Mineurs dans une piscine privée du centre",
    },
    correctAnswers: ["A", "B", "C"],
  },

  {
    id: 9,
    question: "Un BNSSA pour exercer en milieu naturel",
    answers: {
      A: "Peux passer l'unité d'enseignement SSA en Eaux Intérieures",
      B: "Peux passer l'unité d'enseignement mention SSA Littoral",
      C: "Une formation en piscine donne les compétences de ces deux unités d'enseignements",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 10,
    question: "Un BNSSA peut enseigner contre rémunération",
    answers: {
      A: "L'aquagym",
      B: "La natation",
      C: "Il ne peut rien enseigner",
    },
    correctAnswers: ["C"],
  },

  {
    id: 11,
    question:
      "A partir de quel âge peut-on conduire un scooter des mers, avec un permis",
    answers: {
      A: "14 ans",
      B: "18 ans",
      C: "16 ans",
    },
    correctAnswers: ["C"],
  },

  {
    id: 12,
    question:
      "Un BNSSA peut-il surveiller en autonomie une baignade d'accès payant",
    answers: {
      A: "Non",
      B: "Oui à la condition d'avoir obtenu une dérogation préfectorale",
      C: "Oui, depuis un arrêté publié en juin 2023",
    },
    correctAnswers: ["C"],
  },

  {
    id: 13,
    question: "Quel sont les permis de navigation pour la plaisance",
    answers: {
      A: "Permis Fluvial",
      B: "Permis côtier",
      C: "Capitaine 200",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 14,
    question:
      "Durée de la dérogation préfectorale pour un employeur qui ne trouve pas de MNS",
    answers: {
      A: "Elle n'existe plus",
      B: "2 mois mini à 6 mois maxi",
      C: "1 an maxi",
    },
    correctAnswers: ["A"],
  },

  {
    id: 15,
    question: "Un SB peut travailler",
    answers: {
      A: "En piscine comme assistant d'un MNS",
      B: "Dans le cadre d'un Accueil Collectif de Mineurs",
      C: "Toute l'année comme salarié",
    },
    correctAnswers: ["B"],
  },

  {
    id: 16,
    question:
      "Qui est le premier responsable de la zone des 300 mètres sur le littoral maritime",
    answers: {
      A: "Le Maire",
      B: "Le Ministre de l'Intérieur",
      C: "Le Préfet Maritime",
    },
    correctAnswers: ["A"],
  },

  // THEME : ORGANISATION ADMINISTRATIVE
  {
    id: 17,
    question: "Combien y a t-il de CROSS en Méditerranée",
    answers: {
      A: "1",
      B: "2",
      C: "3",
    },
    correctAnswers: ["A"],
  },

  {
    id: 18,
    question:
      "Qui a autorité pour intervenir en premier dans le cas d'une pollution sur la plage",
    answers: {
      A: "Le Maire",
      B: "Le Préfet du département",
      C: "Le Préfet Maritime",
    },
    correctAnswers: ["A"],
  },

  {
    id: 19,
    question:
      "Qui coordonne les secours dans le cas d'une personne disparue en mer",
    answers: {
      A: "Le SDIS",
      B: "La SNSM",
      C: "Le CROSS",
    },
    correctAnswers: ["C"],
  },

  {
    id: 20,
    question: "En milieu naturel, il existe :",
    answers: {
      A: "1 catégorie de baignade",
      B: "2 catégories de baignades",
      C: "3 catégories de baignades",
    },
    correctAnswers: ["C"],
  },

  {
    id: 21,
    question:
      "Qui rémunère le personnel pour armer les postes de secours d'une commune",
    answers: {
      A: "Le Maire",
      B: "Le Préfet du département",
      C: "Le Préfet Maritime",
    },
    correctAnswers: ["A"],
  },

  {
    id: 22,
    question:
      "Qui à autorité sur les opérations de sauvetage au-delà de 300m du bord de plage",
    answers: {
      A: "Le Maire",
      B: "Le Préfet du département",
      C: "Le Préfet Maritime",
    },
    correctAnswers: ["C"],
  },

  {
    id: 23,
    question: "Le SAMU est",
    answers: {
      A: "Un service de secours hospitalier",
      B: "Rattaché aux sapeurs pompiers",
      C: "Dispose de SMUR",
    },
    correctAnswers: ["A", "C"],
  },

  // THEME : ORGANISATION DE LA SECURITE
  {
    id: 24,
    question: "Les drapeaux de couleur",
    answers: {
      A: "Sont au nombre de 3 (Verte / jaune / Rouge)",
      B: "Sont obligatoires en piscine",
      C: "Doivent être hissées à une hauteur visible de toute la zone surveillée",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 25,
    question: "Le CODIS gère les interventions de secours pour",
    answers: {
      A: "Les SMUR",
      B: "Les sapeurs-pompiers",
      C: "La SNSM",
    },
    correctAnswers: ["B"],
  },

  {
    id: 26,
    question: "Le CROSS veille",
    answers: {
      A: "Au respect des règlements maritimes nationaux",
      B: "A la sécurité des gens de la mer",
      C: "Au respect des règles de plongée en mer",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 27,
    question: "Les CROSS sont gérés par",
    answers: {
      A: "Les préfectures de département",
      B: "Les préfectures maritimes",
      C: "Les sous préfectures",
    },
    correctAnswers: ["B"],
  },

  {
    id: 28,
    question: "Les bouées de la zone de baignade",
    answers: {
      A: "Sont de couleur jaune",
      B: "Sont de forme sphérique",
      C: "Sont de forme cylindrique",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 29,
    question: "Pour fermer un poste de secours, le drapeau est baissé",
    answers: {
      A: "Avant le rangement de tout le matériel",
      B: "Après le rangement de tout le matériel",
      C: "A l'heure fixée par les horaires de surveillance",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 30,
    question: "Le POSS c'est",
    answers: {
      A: "Un Plan d'Organisation de la Surveillance et des Secours",
      B: "Un Plan d'Occupation du Sauvetage et des Secours",
      C: "Le Préfet Opérationnel pour la Sécurité et le Sauvetage",
    },
    correctAnswers: ["A"],
  },

  // THEME : SURVEILLANCE ET SECURITE DES ACTIVITES SPECIFIQUES
  {
    id: 31,
    question:
      "En qualité de BNSSA avec un Accueil Collectif de Mineurs, vous pouvez",
    answers: {
      A: "Aller vous baigner où vous voulez",
      B: "Vous baigner en dehors de zones surveillées sous certaines conditions",
      C: "Vous baigner sur des plages surveillées",
    },
    correctAnswers: ["B", "C"],
  },

  {
    id: 32,
    question: "Pour pratiquer la chasse sous-marine ;",
    answers: {
      A: "Vous pouvez chasser la nuit",
      B: "Vous pouvez utiliser un fusil à air comprimé",
      C: "Vous devez avoir au moins 16 ans",
    },
    correctAnswers: ["C"],
  },

  {
    id: 33,
    question:
      "Si un groupe de 40 enfants de plus de 6 ans est sur une plage « non surveillée » mais autorisée avec 1 Surveillant de Baignade et 8 animateurs.",
    answers: {
      A: "Le SB peut organiser une baignade",
      B: "La baignade doit être matérialisée",
      C: "Il n'y a pas d'obligation de matérialisation ou de balisage",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 34,
    question: "La pêche en mer",
    answers: {
      A: "Est autorisée dans les zones de baignade",
      B: "Est interdite dans les ports",
      C: "Les pêcheurs non professionnels peuvent vendre le produit de leur pêche",
    },
    correctAnswers: ["B"],
  },

  {
    id: 35,
    question:
      "Quelle est la vitesse maximale autorisée avec un bateau à moteur dans la zone des 300 mètres?",
    answers: {
      A: "3 nœuds",
      B: "5 nœuds",
      C: "Non limitée",
    },
    correctAnswers: ["B"],
  },

  {
    id: 36,
    question: "Avec une planche à voile, je peux m'éloigner de la côte",
    answers: {
      A: "Jusqu'à 1 mille d'un abri",
      B: "Jusqu'à 2 milles d'un abri",
      C: "Jusqu'à 6 milles d'un abri",
    },
    correctAnswers: ["B"],
  },

  {
    id: 37,
    question: "Les surfeurs",
    answers: {
      A: "Doivent être au maximum à deux sur une vague",
      B: "Evoluent si elle existe dans une zone délimitée par un drapeau à damier noir et blanc",
      C: "Doivent interrompre leur activité si le drapeau des baignades est rouge",
    },
    correctAnswers: ["A", "B"],
  },

  // THEME : CONDUITE A TENIR EN CAS D'ACCIDENT, PREMIERS SOINS
  {
    id: 38,
    question: "La noyade",
    answers: {
      A: "Est une asphyxie",
      B: "A toujours pour origine une défaillance physique (épuisement, manque de technique)",
      C: "Nécessite un suivi médical après inhalation",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 39,
    question: "Lors d'un accident de plongée",
    answers: {
      A: "Il suffit d'organiser la prise en charge du plongeur accidenté",
      B: "Il faut organiser la prise en charge de la palanquée complète",
      C: "En mer, le CROSS doit être informé",
    },
    correctAnswers: ["B", "C"],
  },

  {
    id: 40,
    question: "Un malaise grave dû à une exposition trop prolongée au soleil",
    answers: {
      A: "Peut avoir une répercussion sur la conscience",
      B: "Peut être le signe d'une atteinte grave",
      C: "Peut se rétablir juste en faisant boire la personne",
    },
    correctAnswers: ["A", "B"],
  },
];
