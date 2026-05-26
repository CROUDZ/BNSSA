export type AnswerKey = "A" | "B" | "C" | "D" | "E";

export type Question = {
  id: number;
  question: string;
  answers: Partial<Record<AnswerKey, string>>;
  correctAnswers: AnswerKey[];
};

export const qcm3: Question[] = [
  {
    id: 1,
    question: "Une noyade",
    answers: {
      A: "Peut être provoquée par un malaise dans l’eau",
      B: "Peut être provoquée un traumatisme violent",
      C: "Est toujours le fait d’un mauvais nageur",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 2,
    question: "Vous avez un vent de terre sous petite brise, que faites-vous",
    answers: {
      A: "Je hisse le drapeau rouge",
      B: "Je hisse le drapeau jaune",
      C: "Je laisse le drapeau vert",
    },
    correctAnswers: ["C"],
  },

  {
    id: 3,
    question:
      "Lorsqu’aucun drapeau n’est hissé durant les heures de surveillance",
    answers: {
      A: "La baignade n’est plus surveillée",
      B: "Tous les sauveteurs sont peut-être en intervention",
      C: "La baignade est interdite",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 4,
    question: "Les baïnes",
    answers: {
      A: "Sont dangereuses pour la baignade",
      B: "Peuvent entraîner un nageur au large",
      C: "Peuvent amener les sauveteurs à rétrécir la zone de baignade",
    },
    correctAnswers: ["A", "B", "C"],
  },

  {
    id: 5,
    question: "La signalisation des baignades",
    answers: {
      A: "Comporte des drapeaux de couleurs qui signalent des niveaux risques",
      B: "Comporte des drapeaux de délimitation de zone",
      C: "Des marques transversales",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 6,
    question: "La signalisation des postes de secours",
    answers: {
      A: "Le poste de secours doit être peint en blanc",
      B: "Un bandeau de couleur rouge et jaune doit faire le tour complet de la structure",
      C: "L’inscription « sauveteur – lifeguard » doit figurer sur la partie jaune du bandeau",
    },
    correctAnswers: ["B", "C"],
  },

  {
    id: 7,
    question: "Le code vestimentaire",
    answers: {
      A: "Le personnel de surveillance doit porter une tenue distincte",
      B: "Le rouge est la couleur dominante du haut du corps",
      C: "La mention « SAUVETEUR – LIFEGUARD » doit figurer dans le dos",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 8,
    question: "Les analyses d’eau",
    answers: {
      A: "Leur affichage n’est pas obligatoire",
      B: "Sont uniquement réalisées en piscine",
      C: "Sont effectuées sous le contrôle de l’ARS",
    },
    correctAnswers: ["C"],
  },

  {
    id: 9,
    question:
      "Quels sont le ou les diplômes permettant d’enseigner la natation scolaire ?",
    answers: {
      A: "Le BNSSA",
      B: "Le MNS",
      C: "Le SB",
    },
    correctAnswers: ["B"],
  },

  {
    id: 10,
    question:
      "Qui peut assurer l’enseignement contre rémunération de l’aquagym ?",
    answers: {
      A: "BNSSA",
      B: "MNS",
      C: "Aucun diplôme n’est requis",
    },
    correctAnswers: ["B"],
  },

  {
    id: 11,
    question: "Avec le BNSSA, je…",
    answers: {
      A: "Peut assurer la surveillance d’un accès payant, en assistance d’un MNS",
      B: "Peut assurer la surveillance d’un plan d’eau d’accès gratuit",
      C: "Peut enseigner l’Aisance Aquatique",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 12,
    question:
      "Pour revalider le diplôme de surveillant sauveteur aquatique, je …",
    answers: {
      A: "Doit suivre une formation continue en secourisme tous les ans",
      B: "Doit satisfaire à une formation continue du BNSSA tous les 5 ans",
      C: "Peux me présenter en candidat libre",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 13,
    question: "Un MNS doit être titulaire du diplôme suivant :",
    answers: {
      A: "BEESAN",
      B: "BPJEPSAAN",
      C: "BNSSA",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 14,
    question: "Un BNSSA est exclusivement chargé",
    answers: {
      A: "De la surveillance des baignades",
      B: "Du sauvetage des personnes",
      C: "De l’enseignement de la natation",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 15,
    question:
      "La limite de compétence d’un maire du littoral en matière de baignades",
    answers: {
      A: "Est fixé à 300m du bord",
      B: "Est fixé à 2 milles des côtes",
      C: "Lui donne un pouvoir de police spéciale",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 16,
    question:
      "Le niveau de responsabilité qui peut être engagé au niveau du surveillant est",
    answers: {
      A: "La responsabilité pénale",
      B: "La responsabilité personnelle",
      C: "La responsabilité civile",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 17,
    question: "Catégories de navigations",
    answers: {
      A: "Les navires de plaisance sont classés en 4ème catégorie de conception",
      B: "La catégorie C définit la navigation à proximité des côtes",
      C: "Un bateau peut affronter toutes les conditions de mer",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 18,
    question: "Le préfet maritime peut intervenir dans la zone des 300 mètres",
    answers: {
      A: "Si l’ampleur de la catastrophe est trop importante pour être gérée par le Maire",
      B: "Seulement si le Maire donne son accord",
      C: "Si la zone n’est pas aménagée pour la baignade",
    },
    correctAnswers: ["A"],
  },

  {
    id: 19,
    question: "Dans les S.D.I.S., il y a",
    answers: {
      A: "Des policiers",
      B: "Des sapeurs pompiers",
      C: "Des gendarmes",
    },
    correctAnswers: ["B"],
  },

  {
    id: 20,
    question: "Les limites de zone de bain",
    answers: {
      A: "Elles peuvent être délimitées par des drapeaux rouge et jaune",
      B: "Elles déterminent la limite de réglementation du Maire",
      C: "En mer, vers le large la responsabilité administrative du Maire s’arrête à 300m",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 21,
    question: "Le CROSS est",
    answers: {
      A: "Un organisme d’état qui coordonne les sauvetages en mer",
      B: "Un organisme d’état qui organise la pratique sportive",
      C: "Un organisme d’état rattaché aux sapeurs-pompiers",
    },
    correctAnswers: ["A"],
  },

  {
    id: 22,
    question: "Le SAMU",
    answers: {
      A: "Service d’Aide Médicale Urgente",
      B: "Service d’Assistance Médicalisé d’Urgence",
      C: "Il dispose de SMUR",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 23,
    question: "Dans un établissement de bain d’accès payant",
    answers: {
      A: "L’affichage des diplômes est obligatoire",
      B: "L’affichage des diplômes n’est pas obligatoire",
      C: "Le personnel doit être déclaré auprès de la DDCSPP",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 24,
    question: "Où le POSS doit-il être obligatoirement affiché",
    answers: {
      A: "Dans tous les établissements de bain d’accès payant",
      B: "Dans les lieux de baignade autorisés et d’accès payant",
      C: "Dans les piscines de copropriétés",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 25,
    question:
      "Suite à un appel du CROSS tous les sauveteurs doivent partir en mer porter secours",
    answers: {
      A: "Hissent le drapeau rouge",
      B: "Abaissent le drapeau",
      C: "Font évacuer la baignade",
    },
    correctAnswers: ["B"],
  },

  {
    id: 26,
    question: "Le drapeau rouge est hissé",
    answers: {
      A: "Il signale que la zone de baignade est surveillée mais interdite",
      B: "Il permet au sauveteur de quitter le poste",
      C: "Il indique que la baignade est dangereuse mais surveillée",
    },
    correctAnswers: ["A"],
  },

  {
    id: 27,
    question: "En cas d’accident grave en piscine",
    answers: {
      A: "Si on est qu’à deux sauveteurs, je peux faire évacuer le bassin",
      B: "On est qu’à deux sauveteurs, je gère seul",
      C: "Je mets en œuvre le POSS",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 28,
    question: "Pendant que je suis affecté à la surveillance",
    answers: {
      A: "Je peux me situer sur une chaise haute",
      B: "Je peux me déplacer autour du bassin",
      C: "Je peux utiliser mon téléphone",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 29,
    question: "Qui coordonne les secours en mer",
    answers: {
      A: "Les CRS",
      B: "Le SDIS",
      C: "Le CROSS",
    },
    correctAnswers: ["C"],
  },

  {
    id: 30,
    question:
      "En accueil collectif de mineurs, la réglementation exige en milieu naturel",
    answers: {
      A: "Pas plus de 40 enfants dans l’eau",
      B: "Un périmètre doit délimiter la zone de bain",
      C: "Un BNSSA peut surveiller ce genre de public",
    },
    correctAnswers: ["A", "B", "C"],
  },

  {
    id: 31,
    question: "La zone de bain en milieu naturel",
    answers: {
      A: "Le Maire est responsable de sa matérialisation",
      B: "Le Préfet maritime est responsable de sa matérialisation",
      C: "Est parfois matérialisée par les sauveteurs",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 32,
    question:
      "Lors de sa 1ère prise de service en milieu naturel un surveillant sauveteur",
    answers: {
      A: "Doit s’informer sur les risques",
      B: "Doit vérifier l’ensemble du matériel",
      C: "Doit détenir le permis bateau",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 33,
    question: "Le POSS dans un établissement payant",
    answers: {
      A: "Doit être affiché dans un endroit visible au public",
      B: "N’est pas obligatoirement affiché",
      C: "Recense tous les risques potentiels",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 34,
    question: "En piscine, un accueil collectif de mineurs",
    answers: {
      A: "Doit venir avec un SB",
      B: "Doit venir avec un BNSSA",
      C: "Est placé exclusivement sous la surveillance du personnel",
    },
    correctAnswers: ["C"],
  },

  {
    id: 35,
    question: "En piscine les zones sensibles sont",
    answers: {
      A: "Les angles des bassins",
      B: "Les zones d’ombre",
      C: "Les pédiluves",
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 36,
    question: "Une activité subaquatique peut être signalée par",
    answers: {
      A: "Un pavillon Bleu et Blanc Alpha",
      B: "Un pavillon Rouge et Blanc nommé « Croix de St André »",
      C: "Un pavillon Rouge barré d’une bande blanche nommé « CMAS »",
    },
    correctAnswers: ["A", "B", "C"],
  },

  {
    id: 37,
    question: "En milieu naturel, la surveillance des plages en métropole",
    answers: {
      A: "S’effectue toute l’année",
      B: "S’effectue en été",
      C: "La durée de la surveillance est définie par le Maire",
    },
    correctAnswers: ["B", "C"],
  },

  {
    id: 38,
    question: "Le matériel de réanimation cardio-pulmonaire est composé",
    answers: {
      A: "D’un ballon auto-remplisseur",
      B: "D’une bouteille d’air comprimé",
      C: "D’un défibrillateur",
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 39,
    question: "Soins apportés",
    answers: {
      A: "Une personne suspectée d’avoir inhalée de l’eau doit être hospitalisée",
      B: "Une personne inconsciente qui ne ventile pas doit être placée en PLS",
      C: "La défibrillation précoce augmente les chances de survie",
      D: "Certains malaises ou maladies graves peuvent entraîner une détresse vitale dans l’eau",
    },
    correctAnswers: ["A", "C", "D"],
  },

  {
    id: 40,
    question: "Evaluation des fonctions vitales",
    answers: {
      A: "Il existe quatre fonctions vitales",
      B: "Le sauveteur contrôle la ventilation, l’inconscience, la circulation",
      C: "Le Bilan des REGARDS inclut l’évaluation des fonctions vitales",
    },
    correctAnswers: ["C"],
  },
];
