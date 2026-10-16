import type { Dictionary } from "./types";

export const en: Dictionary = {
  brand: "The Mirror",
  hero: {
    navLabel: "Exhibition",
    kicker: "A sociological exhibition",
    title: "The Mirror",
    titleEmphasis: "of Society",
    lead: "A sociological sandbox. 6 personalities. Limited resources. Who will survive when trust is tested?",
    start: "Start Journey",
    continue: "Continue",
  },
  onboarding: {
    navLabel: "Exhibition",
    chapters: "Chapters",
    previous: "Previous",
    next: "Next",
    chooseWorld: "Choose a world",
    chapterOf: (current, total) => `Chapter ${current} of ${total}`,
    chapterAria: (index) => `Chapter ${index}`,
  },
  hype: {
    kicker: "Before the door",
    line1: "Are you ready to enter the Mirror?",
    line2: "In a world where resources run out and trust is only an illusion, which group do you think will last to the end?",
    cta: "Choose World",
  },
  creating: {
    status: "Building the world",
  },
  environment: {
    kicker: "The weather of this place",
    title: "Before you meet anyone",
    lead: "Food appears and disappears. The street has a mood. And a heavy purse is never free. Learn the weather, and the people will start to make sense.",
    panels: [
      {
        kicker: "The harvest",
        title: "Plenty, an ordinary day, and famine",
        body: "Some seasons the ground is generous. Meals keep turning up, again and again, as if the city itself wants you fed. An ordinary day is narrower: enough appears to live, never enough to relax. Then famine comes. The ground almost stops giving. What little does appear does not wait — leave a meal untouched and it rots. In that cold, generosity becomes a luxury, and even kind people start counting crumbs.",
      },
      {
        kicker: "The mood",
        title: "A street that remembers",
        body: "The city begins hopeful. Every fair trade lifts the whole street a little. A betrayal cuts twice as deep as that kindness healed. A brawl cuts deeper still. A successful mugging cracks the city's faith harder than any argument. And when that faith falls far enough, the gentle people simply stop. Grief pins them in place while everyone else keeps moving.",
      },
      {
        kicker: "The cost",
        title: "Weight, and the shove",
        body: "Wealth is not a blanket. Every pile you carry makes simply staying alive more expensive, as if the pocket itself grew heavier. And nobody shares a square for long. Come within arm's reach — to trade, to fight, to pass — and you are both pushed apart. A handshake never ends with someone still in your pocket.",
      },
    ],
  },
  archetypes: {
    HARDWORKER_COPYCAT: {
      name: "The Hard Worker",
      epithet: "Copycat",
      roster: "Hard Worker",
      label: "HardWorker Copycat",
      short: "HardWorker",
      body: "We all know that one colleague who gives 100% and starts every relationship with pure good intentions. They are fair, and they treat you exactly how you treat them. If you help them, they are your best friend. Betray them once, and they will not let you step on them again. They are the backbone of a healthy society.",
      beats: [
        {
          title: "They take the first path",
          body: "They do not scan the horizon. They walk a straight line and notice only what is right in front of them. The first meal they see, they turn toward it. No ranking. No second thoughts. Then they keep walking that new line until something else appears.",
        },
        {
          title: "You get exactly what you gave",
          body: "The first time they meet you, they offer a fair hand. After that, they become whoever you were last time. Return their kindness and they stay your friend. Slight them once and they will not offer the other cheek.",
        },
        {
          title: "They talk over the fence",
          body: "When two of them meet, they trade stories about who cheated whom. A slight can arrive before you have ever shaken their hand. In a healthy street they are the backbone. In a bitter one, the gossip travels faster than you do.",
        },
      ],
    },
    CONTENTED_ALTRUIST: {
      name: "The Contented",
      epithet: "Altruist",
      roster: "Contented",
      label: "Contented Altruist",
      short: "Contented",
      body: "Think of that incredibly kind soul who is always giving and never asking for anything in return. They are happy with the little they have and never chase luxury. In a harsh world they are often taken advantage of. They miss opportunities because their heart is too open for a ruthless market.",
      beats: [
        {
          title: "They never keep score",
          body: "They always offer the fair hand, even to people who have already hurt them. There is no ledger and no revenge. If you know someone who cannot stop being kind, you know them.",
        },
        {
          title: "Enough is a place they can stand",
          body: "Once they have a little put aside, they stop chasing more. A crowd makes them step away rather than shove. They would rather miss a meal than win a scramble.",
        },
        {
          title: "A frightened city freezes them",
          body: "When the street's faith collapses, they go still. And they almost never fight off a thief. The softest people in the room are the easiest to take from.",
        },
      ],
    },
    TALENTED_GRUDGER: {
      name: "The Talented",
      epithet: "Grudger",
      roster: "Talented",
      label: "Talented Grudger",
      short: "Grudger",
      body: "You probably know a brilliant perfectionist who refuses to settle for less. They have incredibly high standards. They will welcome you warmly, but their pride is fragile. Make one mistake, betray them just once, and they will cut you out forever. They hold grudges until the end of time.",
      beats: [
        {
          title: "Small meals are beneath them",
          body: "They see farther than most, and they still refuse the crumbs. If a meal is not worth their pride, they let it pass. If nothing on the street meets that standard, they stand still and burn, too proud to bend.",
        },
        {
          title: "One betrayal closes the door",
          body: "They greet you warmly the first time. Betray them once — any once they can remember — and that door never opens again. They do not forget, and they do not forgive.",
        },
        {
          title: "Pride is expensive",
          body: "Brilliance costs. They live harder than the people who will eat anything. A city of leftovers will starve a perfectionist while a simpler neighbor grows comfortable.",
        },
      ],
    },
    OPTIMIZER_DETECTIVE: {
      name: "The Optimizer",
      epithet: "Detective",
      roster: "Optimizer",
      label: "Optimizer Detective",
      short: "Optimizer",
      body: "The purely logical friend who prices every relationship. They do not act on emotion. They test you. If you show strength, they respect you and cooperate. If you show weakness, they will use you as a stepping stone.",
      beats: [
        {
          title: "Every step has a price",
          body: "They see the whole neighborhood, and simply staying alive costs them less than anyone else — until they start thinking. Before they move, they ask whether the meal is worth the walk. If the math says no, they stay exactly where they are.",
        },
        {
          title: "Too many choices, and they lock",
          body: "Show them a table full of options and they pay just for looking. Then they freeze. Analysis paralysis. Simpler people walk past and eat while the brilliant one is still counting.",
        },
        {
          title: "The second meeting is a test",
          body: "The first time, they are fair. The second time, they betray you, only to see what you do. Strike back and they respect you from then on. Stay soft, keep offering the other cheek, and they will keep taking it.",
        },
      ],
    },
    ARISTOCRAT_VIP: {
      name: "The Aristocrat",
      epithet: "Rich Kid VIP",
      roster: "Aristocrat",
      label: "Aristocrat VIP",
      short: "VIP",
      body: "Born on third base and certain they hit a triple. We have all seen people who inherited their place and never had to hunt a day in their lives. They do not mingle with the regular crowd. They live in an exclusive bubble, collecting rent while the street struggles below.",
      beats: [
        {
          title: "Born full, nearly blind to the street",
          body: "They do not hunt. The table was already set. Now and then rent simply arrives, and sometimes they take a slow stroll, as if the city were a courtyard.",
        },
        {
          title: "A private club that pays for a handshake",
          body: "They do not do business with ordinary people. Two of them recognize each other, and both leave richer. The club is not a job. It is a greeting.",
        },
        {
          title: "The most expensive life, and the tightest locks",
          body: "Living richly burns faster than any other life here, and a heavy purse makes it worse. They survive because money keeps appearing, not because they work. Almost no one can rob them. The locks were built before you arrived.",
        },
      ],
    },
    ROBBER_OPPORTUNIST: {
      name: "The Robber",
      epithet: "Opportunist",
      roster: "Robber",
      label: "Robber Opportunist",
      short: "Robber",
      body: "Thieves are rarely born evil. They are often what a broken season makes. Desperation pushes them to take what is not theirs just to survive. Once survival is guaranteed, desperation turns into greed, and they start hunting the wealthiest targets. They are the chaotic symptom of inequality.",
      beats: [
        {
          title: "They hunt people, not meals",
          body: "While they are poor, they go for whoever is closest. Once they are comfortable, greed changes the target: the richest person they can see. You have watched desperation turn into appetite.",
        },
        {
          title: "Empty streets, they pace",
          body: "If no one is in sight, they do not rest. They walk the alleys, waiting for a shape to appear.",
        },
        {
          title: "A grab is not a trade",
          body: "They never offer a fair deal, and they never hunt their own. If you fight them off, they pay for the attempt. If you cannot, they take a serious cut of everything you carry, and the whole city flinches.",
        },
      ],
    },
  },
  personOf: (index, total, epithet) => `Person ${index} of ${total} · ${epithet}`,
  worlds: {
    kicker: "Step inside a society",
    title: "Choose a world",
    lead: "Four written societies, and a fifth you compose. The mix of strategies decides who eats, who hoards, and who gets robbed.",
    presetsAria: "World presets",
    population: "Population",
    totalPopulation: "Total population",
    initialize: "Initialize World",
    agentTypes: "Agent types",
    populationLabel: "Population",
    noAgentsYet: "No agents yet",
    balancedMix: "Balanced mix",
    noAgents: "No agents",
    eachStrategy: "Each strategy",
    intoWorld: (name) => `into ${name}`,
    ledBy: (name) => `Led by ${name}`,
    shareAria: (parts) => parts,
    removeOne: (label) => `Remove one ${label}`,
    addOne: (label) => `Add one ${label}`,
    countOf: (label) => `${label} count`,
    choices: {
      gotham: {
        name: "Gotham City",
        epithet: "Social Collapse",
        description:
          "A dying city overrun by crime and corruption. The working class is nearly extinct, while the elites hide behind high walls.",
      },
      cutthroat: {
        name: "Cutthroat Capitalism",
        epithet: "Ruthless Competition",
        description:
          "A cold, hyper-efficient market. Everyone calculates ROI. Trust is low, but the economy thrives on ruthless competition.",
      },
      welfare: {
        name: "The Welfare State",
        epithet: "High Trust",
        description:
          "A highly trusting, prosperous society. However, this naive optimism makes it a perfect breeding ground for a few hidden parasites.",
      },
      "class-war": {
        name: "Class War",
        epithet: "Polarized Economy",
        description:
          "A heavily polarized economy. The masses toil relentlessly while a massive aristocratic class hoards the wealth, sparking constant rebellions.",
      },
      custom: {
        name: "Custom",
        epithet: "Your Mix",
        description:
          "Set the headcount of every strategy yourself. The world starts as the society you compose — nothing added, nothing hidden.",
      },
    },
  },
  hud: {
    pause: "Pause simulation",
    start: "Start simulation",
    tick: "Tick",
    trust: "Societal trust",
    population: "Population",
    cookies: "Cookies",
    settings: "Settings",
    analytics: "Analytics",
    seasons: {
      NORMAL: "Normal",
      BOOM: "Boom",
      BUST: "Bust",
    },
  },
  map: {
    dragToPan: "Drag to pan",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
  },
  settings: {
    title: "Game settings",
    subtitle: "Season, population, cookies",
    close: "Close",
    season: "Season",
    countPerType: "Count per type",
    total: (count) => `Total: ${count}`,
    scatter: (count) => `Scatter ${count} cookies`,
    apply: "Apply and restart",
  },
  analytics: {
    title: "Analytics",
    subtitle: "Living mix and wealth share",
    close: "Close",
    noneAlive: "No agents left alive.",
    populationLeader: "Population leader:",
    wealthLeader: "Wealth leader:",
    leaderJoin: "—",
    wealthShareOf: (percent, total) => `(${percent}% of ${total})`,
    livingPopulation: "Living population",
    wealthShare: "Wealth share",
  },
  log: {
    title: "Event log",
    subtitle: "The society's brain, live",
    close: "Close",
    empty: "No events yet. Start the game.",
    kinds: {
      COOKIE_SPAWN: "Cookie",
      COOKIE_PICKUP: "Pickup",
      DEATH: "Death",
      ROBBERY_SUCCESS: "Robbery",
      ROBBERY_FAIL: "Robbery failed",
      COOPERATE: "Cooperate",
      BETRAY: "Betray",
      FIGHT: "Fight",
      VIP_CLUB: "VIP club",
      OPTIMIZER_OVERLOAD: "Overload",
    },
  },
  inspect: {
    close: "Close inspect panel",
    stats: "Stats",
    wealth: "Wealth",
    metabolism: "Metabolism",
    burden: "Burden",
    gossip: "Recent Gossip / Memory",
    noEncounters: "No encounters recorded yet.",
    me: (action) => `Me: ${action}`,
    them: (action) => `Them: ${action}`,
    actions: {
      COOPERATE: "COOPERATE",
      DEFECT: "DEFECT",
      IGNORE: "IGNORE",
    },
  },
  language: "Language",
};
