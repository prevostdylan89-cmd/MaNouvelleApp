// constants.js

export const BLOCS = [
  {
    name: "Bloc Méga-Évolution (2025 - 2026)",
    editions: [
      "Méga-Évolution (Base)",
      "Flammes Fantasmagoriques",
      "Héros Transcendants (Série spéciale 30 ans)",
      "Équilibre Parfait",
      "Chaos Ascendant (Mai 2026)",
      "ME05 - Éternels (Juillet 2026)"
    ]
  },
  {
    name: "🏜️ Bloc Écarlate et Violet (2023 - 2025)",
    editions: [
      "Écarlate et Violet (Base)",
      "Évolutions à Paldea",
      "Flammes Obsidiennes",
      "151 (Série spéciale nostalgie)",
      "Faille Paradoxe",
      "Destinées de Paldea (Série 'Shiny')",
      "Forces Temporelles",
      "Mascarade Crépusculaire",
      "Fable Nébuleuse",
      "Couronne Stellaire",
      "Étincelles Déferlantes",
      "Évolutions Prismatiques (Série spéciale Évolition)",
      "Aventures Ensemble",
      "Rivalités Destinées",
      "Foudre Noire / Flamme Blanche"
    ]
  },
  {
    name: "⚔️ Bloc Épée et Bouclier (2020 - 2023)",
    editions: [
      "Épée et Bouclier (Base)",
      "Clash des Rebelles",
      "Ténèbres Embrasées",
      "La Voie du Maître (Spécial)",
      "Voltage Éclatant",
      "Destinées Radieuses (Shiny)",
      "Styles de Combat",
      "Règne de Glace",
      "Évolution Céleste",
      "Célébrations (25 ans)",
      "Poing de Fusion",
      "Astres Radieux",
      "Origine Perdue",
      "Tempête Argentée",
      "Zénith Suprême"
    ]
  },
  {
    name: "☀️ Bloc Soleil et Lune (2017 - 2019)",
    editions: [
      "Soleil et Lune (Base)",
      "Gardiens Ascendants",
      "Ombres Ardentes",
      "Légendes Brillantes",
      "Invasion Carmin",
      "Ultra-Prisme",
      "Lumière Interdite",
      "Tempête Céleste",
      "Majesté des Dragons",
      "Tonnerre Perdu",
      "Duo de Choc",
      "Alliance Infaillible",
      "Harmonie des Esprits",
      "Destinées Occultes (Shiny)",
      "Éclipse Cosmique"
    ]
  },
  {
    name: "🧬 Bloc XY (2014 - 2016)",
    editions: [
      "XY (Base)",
      "Étincelles",
      "Poings Furieux",
      "Vigueur Spectrale",
      "Primo-Choc",
      "Ciel Rugissant",
      "Origines Antiques",
      "Impulsion Turbo",
      "Rupture Turbo",
      "Générations (20 ans)",
      "Impact des Destins",
      "Offensive Vapeur",
      "Évolutions"
    ]
  },
  {
    name: "🌑 Bloc Noir & Blanc (2011 - 2013)",
    editions: [
      "Noir & Blanc (Base)",
      "Pouvoirs Émergents",
      "Nobles Victoires",
      "Destinées Futures",
      "Explorateurs Obscurs",
      "Dragons Exaltés",
      "Coffret des Dragons",
      "Frontières Piégées",
      "Tempête Plasma",
      "Glaciation Plasma",
      "Explosion Plasma",
      "Trésors Légendaires"
    ]
  },
  {
    name: "⚜️ Blocs Rétro (1999 - 2010)",
    editions: [
      "HeartGold SoulSilver",
      "Déchaînement",
      "Indomptable",
      "Triomphe",
      "Appel des Légendes",
      "Platine",
      "Rivaux Émergeants",
      "Vainqueurs Suprêmes",
      "Arceus",
      "Diamant & Perle",
      "Trésors Mystérieux",
      "Duels au Sommet",
      "Aube Majestueuse",
      "Éveil des Légendes",
      "Tempête",
      "Rubis & Saphir",
      "Tempête de Sable",
      "Dragon",
      "Team Magma vs Team Aqua",
      "Légendes Oubliées",
      "Rouge Feu & Vert Feuille",
      "Team Rocket Returns",
      "Deoxys",
      "Émeraude",
      "Forces Unies",
      "Espèces Delta",
      "Créateurs de Légendes",
      "Fantômes Holon",
      "Gardiens de Cristal",
      "Île des Dragons",
      "Gardiens du Pouvoir",
      "Expédition",
      "Aquapolis",
      "Skyridge",
      "Genesis",
      "Discovery",
      "Revelation",
      "Destiny",
      "Set de Base",
      "Jungle",
      "Fossile",
      "Team Rocket",
      "Gym Heroes",
      "Gym Challenge"
    ]
  }
];

// Pour faciliter la recherche, on génère une liste plate de toutes les éditions
export const ALL_EDITIONS = BLOCS.flatMap(bloc => bloc.editions);