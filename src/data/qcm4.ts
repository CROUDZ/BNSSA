// src/data/qcm4.ts

export type AnswerKey = "A" | "B" | "C" | "D" | "E";

export type Question = {
  id: number;
  question: string;
  answers: Partial<Record<AnswerKey, string>>;
  correctAnswers: AnswerKey[];
};

export const qcm4: Question[] = [
  {
    id: 1,
    question: 'L’échelle de Beaufort est :',
    answers: {
      A: 'Une grille de notation des sauveteurs en fin de saison',
      B: 'Une grille qui indique la force du vent et les effets sur l’état de la mer',
      C: 'Une échelle de valeur qui informe de la hauteur des marées',
      D: 'Internationale et permet à tous les marins, les gens de la mer de la comprendre',
    },
    correctAnswers: ["B", "D"],
  },

  {
    id: 2,
    question: 'Les baïnes :',
    answers: {
      A: 'Doivent être situées dans la zone de baignade pour être sécurisée au maximum',
      B: 'Sont dangereuses pour la baignade',
      C: 'Peuvent entraîner un nageur au large',
      D: 'Peuvent amener les sauveteurs à rétrécir la zone de baignade',
    },
    correctAnswers: ["B", "C", "D"],
  },

  {
    id: 3,
    question: 'Il existe, dans la réglementation française, plusieurs catégories de baignades :',
    answers: {
      A: 'Les baignades interdites / aux risques et périls des usagers / autorisées et aménagées',
      B: 'Les baignades aux risques et périls des usagers / autorisées et surveillées',
      C: 'Les baignades aux risques et périls des usagers / surveillées / non-surveillées',
    },
    correctAnswers: ["A"],
  },

  {
    id: 4,
    question: 'Pour prendre la météo marine, vous pouvez :',
    answers: {
      A: 'Faire le 112',
      B: 'Consulter l’application mobile ou le site internet de Météo France',
      C: 'Ecouter le bulletin météo émis par les CROSS et les Sémaphores sur le canal VHF',
    },
    correctAnswers: ["B", "C"],
  },

  {
    id: 5,
    question: 'Sur chaque lieu de baignade :',
    answers: {
      A: 'Il est obligatoire d’avoir un poste de secours',
      B: 'La décision d’implantation d’un poste de secours est en premier ressort de la compétence du maire',
      C: 'En l’absence de surveillance, la baignade est aux risques et périls de l’usager',
    },
    correctAnswers: ["B", "C"],
  },

  {
    id: 6,
    question: 'Lorsque l’on vient du large, les chenaux traversiers :',
    answers: {
      A: 'Sont matérialisés par des bouées cylindriques à bâbord',
      B: 'Sont matérialisés par des bouées cylindriques à tribord',
      C: 'Sont matérialisés par des bouées de couleurs jaunes',
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 7,
    question: 'Qui détermine la couleur de la flamme :',
    answers: {
      A: 'L’échelle de Beaufort',
      B: 'Le maire de la commune',
      C: 'Le chef de poste',
      D: 'Le responsable local de Météo France',
    },
    correctAnswers: ["C"],
  },

  {
    id: 8,
    question: 'En piscine les analyses d’eau effectuées par le personnel :',
    answers: {
      A: 'Peuvent entraîner la fermeture d’une baignade si elles sont mauvaises',
      B: 'Sont obligatoires une fois par mois',
      C: 'Doivent être effectuées au moins deux fois par jours',
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 9,
    question: 'Un BNSSA peut enseigner contre rémunération :',
    answers: {
      A: 'Oui, l’aquagym',
      B: 'Oui, la natation',
      C: 'Non, il ne peut rien enseigner',
    },
    correctAnswers: ["C"],
  },

  {
    id: 10,
    question: 'Les CROSS principaux sont au nombre de :',
    answers: {
      A: '2 en outre-mer',
      B: '8 en métropole',
      C: '5 en métropole',
      D: '4 en outre-mer',
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 11,
    question: 'Dans la zone des 300 mètres :',
    answers: {
      A: 'Le préfet maritime est le seul responsable',
      B: 'Le préfet maritime peut intervenir en cas de forte pollution',
      C: 'Le maire exerce la police des baignades',
    },
    correctAnswers: ["B", "C"],
  },

  {
    id: 12,
    question: 'Un BNSSA peut surveiller en autonomie :',
    answers: {
      A: 'Un plan d’eau d’accès gratuit',
      B: 'Une piscine payante',
      C: 'Un accueil collectif de mineur dans une piscine privée du centre',
      D: 'Une baignade en mer',
    },
    correctAnswers: ["A", "B", "C", "D"],
  },

  {
    id: 13,
    question: 'En mer, dans la zone des 300 mètres et en l’absence de balisage ou en présence d’un balisage :',
    answers: {
      A: 'Je peux pratiquer le ski nautique',
      B: 'Je ne dois pas dépasser les 3 nœuds',
      C: 'Je ne dois pas dépasser les 5 nœuds',
      D: 'Il n’y a pas de limitation',
    },
    correctAnswers: ["C"],
  },

  {
    id: 14,
    question: 'Parmi ces obligations, lesquelles sont applicables au BNSSA souhaitant exercer en piscine :',
    answers: {
      A: 'Être titulaire du certificat de compétence PSE2',
      B: 'Le récépissé de déclaration délivré par les services de l’état',
      C: 'Le certificat de vaccination pour l’hépatite B',
      D: 'La formation continue à jour',
    },
    correctAnswers: ["B", "D"],
  },

  {
    id: 15,
    question: 'La responsabilité civile d’un BNSSA peut être engagée pour une faute dont l’origine est considérée comme :',
    answers: {
      A: 'Uniquement volontaire',
      B: 'Volontaire et non-volontaire',
      C: 'Uniquement involontaire',
    },
    correctAnswers: ["B"],
  },

  {
    id: 16,
    question: 'Avec le permis plaisance, option côtière, extension hauturière, on peut naviguer :',
    answers: {
      A: 'En rivière uniquement',
      B: 'De jour comme de nuit',
      C: 'Au-delà de 6 milles d’un abri',
    },
    correctAnswers: ["B", "C"],
  },

  {
    id: 17,
    question: 'En combien de catégories sont classifiées les baignades en eau libre:',
    answers: {
      A: '1 catégorie',
      B: '2 catégories',
      C: '3 catégories',
      D: '4 catégories',
    },
    correctAnswers: ["C"],
  },

  {
    id: 18,
    question: 'Les limites de zone de bain :',
    answers: {
      A: 'Sont délimitées par des drapeaux à bandes horizontales rouge et jaune',
      B: 'Déterminent la limite de réglementation du maire',
      C: 'Peuvent bouger au cours de la journée',
      D: 'En mer, vers le large la responsabilité administrative du maire s’arrête à 300 mètres',
    },
    correctAnswers: ["A", "C", "D"],
  },

  {
    id: 19,
    question: 'Dans un établissement de bain d’accès payant :',
    answers: {
      A: 'L’affichage des diplômes est obligatoire',
      B: 'L’affichage des diplômes n’est pas obligatoire',
      C: 'Le personnel chargé de la surveillance doit être déclaré auprès de la préfecture',
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 20,
    question: 'Où le POSS doit-il obligatoirement être installé :',
    answers: {
      A: 'Dans tous les établissements de bain d’accès payant',
      B: 'Dans les lieux de baignade autorisés et d’accès payant',
      C: 'Dans les piscines de copropriétés',
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 21,
    question: 'Lorsqu’une baignade en milieu naturel est ouverte, les analyses de l’eau sont faites :',
    answers: {
      A: 'A la convenance du maire',
      B: 'Au minimum deux fois par mois',
      C: 'Uniquement en cas d’aspect inquiétant de l’eau',
    },
    correctAnswers: ["B"],
  },

  {
    id: 22,
    question: 'Qui recrute le personnel pour armer les postes de secours :',
    answers: {
      A: 'Le maire',
      B: 'Le préfet du département',
      C: 'Le préfet maritime',
    },
    correctAnswers: ["A"],
  },

  {
    id: 23,
    question: 'Le SAMU :',
    answers: {
      A: 'Est le service d’aide médical urgente',
      B: 'Est le service d’assistance médicalisé d’urgence',
      C: 'Dispose de SMUR',
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 24,
    question: 'Le CROSS :',
    answers: {
      A: 'Coordonne les opérations de sauvetage',
      B: 'Met en place les zones aménagées de baignade',
      C: 'Recrute les équipes qui assurent la surveillance des plages',
      D: 'Assure la surveillance et la police des pêches maritimes',
    },
    correctAnswers: ["A", "D"],
  },

  {
    id: 25,
    question: 'Le POSS est obligatoire :',
    answers: {
      A: 'Dans tous les lieux de baignade',
      B: 'Dans les piscines uniquement',
      C: 'Uniquement dans les lieux d’accès payant',
      D: 'Uniquement lorsqu’il y a un maître-nageur sauveteur',
    },
    correctAnswers: ["C"],
  },

  {
    id: 26,
    question: 'Lors de sa 1ère prise de service en milieu naturel, un BNSSA :',
    answers: {
      A: 'Doit consulter le plan de secours s’il existe',
      B: 'Doit vérifier l’ensemble du matériel',
      C: 'Doit détenir le permis bateau',
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 27,
    question: 'En zone métropolitaine, lorsque l’on vient du large, en entrant dans un port :',
    answers: {
      A: 'On trouve à tribord des balises vertes',
      B: 'On trouve à bâbord des balises rouges',
      C: 'On trouve à tribord des balises rouges',
      D: 'On trouve à bâbord des valises vertes',
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 28,
    question: 'Les sauveteurs abaissent le drapeau :',
    answers: {
      A: 'Quand une intervention importante le nécessite',
      B: 'Pour aller déjeuner, si la surveillance est interrompu',
      C: 'A la fermeture du poste de secours',
      D: 'Quand la mer est dangereuse',
    },
    correctAnswers: ["A", "B", "C"],
  },

  {
    id: 29,
    question: 'Des engins de plage :',
    answers: {
      A: 'Doivent naviguer dans la zone des 300 mètres',
      B: 'Peuvent naviguer jusqu’à 1 mille d’un abri',
      C: 'Nécessitent une surveillance accrue par vent de terre',
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 30,
    question: 'La planche à voile peut se pratiquer :',
    answers: {
      A: 'Dans la bande des 300 mètres',
      B: 'Dans la zone de baignade surveillée',
      C: 'Uniquement en dehors de la zone de baignade',
      D: 'Uniquement en dehors de la bande des 300 mètres',
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 31,
    question: 'Titulaire du BNSSA, avec un accueil collectif de mineurs, vous pouvez aller vous baigner :',
    answers: {
      A: 'Où vous voulez',
      B: 'En dehors des zones surveillées, réputées ne pas être dangereuses',
      C: 'Uniquement sur des plages surveillées',
    },
    correctAnswers: ["B"],
  },

  {
    id: 32,
    question: 'La chasse sous-marine :',
    answers: {
      A: 'Est autorisée avec des bouteilles de plongée',
      B: 'Est autorisée de jour comme de nuit',
      C: 'Il est interdit de détenir un fusil chargé hors de l’eau',
      D: 'Le produit de la pêche peut être vendu',
    },
    correctAnswers: ["C"],
  },

  {
    id: 33,
    question: 'Pour pratiquer le ski nautique :',
    answers: {
      A: 'Le pratiquant doit savoir nager',
      B: 'En rivière, je peux pratiquer n’importe où',
      C: 'En mer, je peux pratiquer au-delà de la zone des 300 mètres',
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 34,
    question: 'Pour la sécurité des plongeurs, un club ou une structure professionnelle doit :',
    answers: {
      A: 'Disposer de matériel de secours',
      B: 'Avoir un directeur de plongée sur place',
      C: 'Se signaler au moyen du pavillon ARMA',
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 35,
    question: 'Une piscine privée et réservée aux enfants d’un accueil collectif de mineurs :',
    answers: {
      A: 'Peut être surveillée par un SB',
      B: 'Peut être surveillée par un BNSSA',
      C: 'Doit obligatoirement être surveillée par un MNS',
    },
    correctAnswers: ["A", "B"],
  },

  {
    id: 36,
    question: 'Dans le cas d’un enfant en arrêt cardiaque, suite à une noyade, il faut :',
    answers: {
      A: 'Commencer immédiatement par faire 5 insufflations',
      B: 'Commencer immédiatement par faire le massage cardiaque',
      C: 'Masser au moins à 100 compressions à la minute',
      D: 'Masser au moins à 150 compressions à la minute',
    },
    correctAnswers: ["A", "C"],
  },

  {
    id: 37,
    question: 'Les stades de la noyade :',
    answers: {
      A: 'Permettent de simplifier la communication entre les sauveteurs',
      B: 'Sont au nombre de cinq tableaux cliniques',
      C: 'Lorsque vous êtes en présence d’un stade 2, la victime est inconsciente',
    },
    correctAnswers: ["A"],
  },

  {
    id: 38,
    question: 'Evaluation des fonctions vitales :',
    answers: {
      A: 'Il existe quatre fonctions vitales',
      B: 'Dans l’ordre, le sauveteur contrôle la circulation, l’inconscience, la ventilation',
      C: 'L’évaluation des fonctions vitales fait partie du bilan',
      D: 'Même en cas d’hémorragie visible, le sauveteur effectue d’abord le contrôle des fonctions vitales',
    },
    correctAnswers: ["C"],
  },

  {
    id: 39,
    question: 'Lors d’une noyade :',
    answers: {
      A: 'Chez l’adulte, il n’est pas nécessaire de réaliser 5 insufflations avant de débuter une réanimation',
      B: 'Chez l’enfant, il est nécessaire de réaliser 5 insufflations avant de débuter une réanimation',
      C: 'On peut effectuer une RCP dans l’eau, lors d’un remorquage',
    },
    correctAnswers: ["B"],
  },

  {
    id: 40,
    question: 'Soins apportés :',
    answers: {
      A: 'Une personne suspectée d’avoir inhaler de l’eau doit être hospitalisée',
      B: 'Une personne inconsciente qui ne ventile pas doit être placée en PLS',
      C: 'La défibrillation précoce augmente les chances de survie d’une réanimation cardio-pulmonaire',
      D: 'Certains malaises ou maladies graves peuvent entraîner une détresse vitale dans l’eau',
    },
    correctAnswers: ["A", "C", "D"],
  },
];
