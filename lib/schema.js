// Configuració declarativa de tot el formulari.
// Cada step té: id, branch (quins perfils el veuen), title, subtitle, fields[].
// Els fields tenen type, id, label, options, required, hint.

export const PROFILES = {
  ADULT: 'adult',           // 1 — Membre adult
  INFANT: 'infant',         // 2 — Infant Polls Folls
  PARE: 'pare',             // 3 — Pare/mare PF (no membre)
  PARE_ADULT: 'pare_adult', // 4 — Pare/mare PF + membre adult
};

export const ALERGIES = ['Gluten', 'Lactosa', 'Fructosa', 'Fruits Secs', 'Vegetarià/na', 'Vega/na', 'Ou', 'Marisc'];

// Branques on apareix cada step
const A = [PROFILES.ADULT, PROFILES.PARE_ADULT];       // bloc adult
const B = [PROFILES.INFANT, PROFILES.PARE, PROFILES.PARE_ADULT]; // bloc infant
const C = [PROFILES.PARE];                              // dades pare/mare no membre

export const STEPS = [
  // ─── S0 perfil ───
  {
    id: 'profile',
    branch: 'all',
    icon: '🔀',
    title: 'Quin perfil et correspon?',
    subtitle: 'Escull la situació que millor t\'encaixi. Així només et farem les preguntes que cal.',
    fields: [
      {
        type: 'profile-cards',
        id: 'profile',
        required: true,
      },
    ],
  },

  // ─── BRANCA ADULT (A) ───
  {
    id: 'adult-data',
    branch: A,
    icon: '👤',
    title: 'Les teves dades',
    subtitle: 'Comencem per uns detalls bàsics teus.',
    fields: [
      { type: 'text', id: 'adult_name', label: 'Nom i cognoms', required: true, placeholder: 'P. ex. Anna Garcia López' },
      { type: 'email', id: 'adult_email', label: 'Adreça electrònica', required: true, placeholder: 'el@teu.email' },
      { type: 'allergies', id: 'adult_alergies', label: 'Intoleràncies o al·lèrgies', hint: 'Marca tot el que apliqui. Important per al sopar del correfoc i el sopar dels idiotes.' },
    ],
  },

  {
    id: 'cercavila-alt',
    branch: A,
    icon: '🙏',
    title: 'Cercavila Alternativa',
    date: 'Dijous 9 de juliol',
    subtitle: 'Acte d\'inici de la Llagastada amb les colles convidades.',
    fields: [
      {
        type: 'single', id: 'cercavila_alt', label: 'T\'agradaria i podries participar-hi?',
        options: [
          { value: 'si', label: 'Sí, podria participar-hi', emoji: '✅' },
          { value: 'no', label: 'No, no puc', emoji: '❌' },
        ],
      },
    ],
  },

  {
    id: 'cercagallines-a',
    branch: A,
    icon: '🐔',
    title: 'Cercagallines',
    date: 'Divendres 10 de juliol',
    subtitle: 'Cercavila pel poble per anar a buscar les gallines als balcons.',
    fields: [
      {
        type: 'single', id: 'cercagallines_a', label: 'Com t\'agradaria participar-hi?',
        options: [
          { value: 'capgros', label: 'Fent de capgròs' },
          { value: 'acomp_capgros', label: 'Acompanyant de capgròs' },
          { value: 'xaranga', label: 'Acompanyar Xaranga' },
          { value: 'balcons', label: 'Estar a balcons' },
          { value: 'recollir', label: 'Recollir les gallines dels balcons' },
          { value: 'carro', label: 'Portar el carro de fusta amb les gallines' },
          { value: 'nunci', label: 'Portar estructura del Nunci i logística' },
          { value: 'confeti', label: 'Tirar confeti' },
          { value: 'barretines', label: 'Venda de barretines i faixes' },
          { value: 'faci_falta', label: 'El que faci falta' },
          { value: 'no', label: 'No puc assistir-hi' },
        ],
      },
    ],
  },

  {
    id: 'cercatapes-a',
    branch: A,
    icon: '🍛',
    title: 'Cercatapes',
    date: 'Dissabte 11 de juliol',
    subtitle: 'Ruta de tapes pel poble amb totes les colles.',
    fields: [
      {
        type: 'single', id: 'cercatapes_a', label: 'Vols participar-hi?',
        options: [
          { value: 'si', label: 'Sí, vull participar!' },
          { value: 'no', label: 'No, no puc' },
        ],
      },
    ],
  },

  {
    id: 'teatre-correfoc',
    branch: A,
    icon: '🔥',
    title: 'Teatre i Correfoc',
    date: 'Dissabte 11 de juliol',
    subtitle: 'L\'acte central. Tres preguntes: teatre, correfoc i sopar.',
    fields: [
      {
        type: 'single', id: 'teatre', label: 'TEATRE — Com vols participar-hi?',
        options: [
          { value: 'anima', label: 'Ànima (acompanyaràs l\'Hefest)' },
          { value: 'furia', label: 'Fúria' },
          { value: 'logistica', label: 'Logística' },
          { value: 'circ', label: 'Circ (escupidor, carioques, malabars...)' },
          { value: 'monjo', label: 'Monjo/a (torxa de foc)' },
          { value: 'music', label: 'Músic/a' },
          { value: 'faci_falta', label: 'El que faci falta' },
          { value: 'no', label: 'No puc/vull participar' },
        ],
      },
      {
        type: 'single', id: 'correfoc', label: 'CORREFOC — Com vols participar-hi?',
        options: [
          { value: 'cremador', label: 'Cremador/a' },
          { value: 'encenedor', label: 'Encenedor/a' },
          { value: 'repartidor', label: 'Repartidor/a' },
          { value: 'circ', label: 'Circ (escupidor, carioques, malabars...)' },
          { value: 'carro_polvori', label: 'Carro polvorí' },
          { value: 'carro_aigua', label: 'Carro Aigua' },
          { value: 'music', label: 'Músic/a' },
          { value: 'seguretat', label: 'Seguretat' },
          { value: 'faci_falta', label: 'El que faci falta' },
          { value: 'no', label: 'No podré participar' },
        ],
      },
      {
        type: 'single', id: 'sopar_correfoc', label: 'SOPAR del Correfoc — Vols entrepà?',
        hint: 'Sopar de germanor just després del correfoc.',
        options: [
          { value: 'si', label: 'Sí, vull entrepà', emoji: '🥪' },
          { value: 'no', label: 'No, no vull entrepà' },
        ],
      },
    ],
  },

  {
    id: 'ensierru-matiner',
    branch: A,
    icon: '🌅',
    title: 'Ensierru Matiner',
    date: 'Diumenge 12 — matí',
    subtitle: 'La versió matinera de l\'ensierru.',
    fields: [
      {
        type: 'single', id: 'ensierru_matiner', label: 'Com t\'agradaria participar-hi?',
        options: [
          { value: 'gallina', label: 'Gallina' },
          { value: 'gall', label: 'Gall' },
          { value: 'carregador', label: 'Carregador/a' },
          { value: 'repartidor', label: 'Repartidor/a' },
          { value: 'encenedor', label: 'Encenedor/a' },
          { value: 'polvori', label: 'Polvorí' },
          { value: 'faci_falta', label: 'El que faci falta' },
          { value: 'no', label: 'No puc participar' },
        ],
      },
      {
        type: 'single', id: 'esmorzar_matiner', label: 'ESMORZAR de forquilla — Voldràs?',
        options: [
          { value: 'si', label: 'Sí, vull esmorzar', emoji: '🍳' },
          { value: 'no', label: 'No, no vull esmorzar' },
        ],
      },
    ],
  },

  {
    id: 'cercavila-diumenge',
    branch: A,
    icon: '💃',
    title: 'Cercavila Diumenge',
    date: 'Diumenge 12 — migdia',
    subtitle: 'Cercavila central amb totes les colles.',
    fields: [
      {
        type: 'single', id: 'esmorzar_cercavila', label: 'ESMORZAR — Voldràs esmorzar?',
        options: [
          { value: 'si', label: 'Sí, vull esmorzar', emoji: '☕' },
          { value: 'no', label: 'No, no vull esmorzar' },
        ],
      },
      {
        type: 'single', id: 'cercavila_diumenge', label: 'Com t\'agradaria participar-hi?',
        options: [
          { value: 'gallina', label: 'Gallina' },
          { value: 'gall', label: 'Gall' },
          { value: 'carregador', label: 'Carregador/a' },
          { value: 'encenedor', label: 'Encenedor/a' },
          { value: 'polvori', label: 'Polvorí' },
          { value: 'faci_falta', label: 'El que faci falta' },
          { value: 'no', label: 'No podré participar' },
        ],
      },
    ],
  },

  {
    id: 'ensierru',
    branch: A,
    icon: '🐓',
    title: 'Ensierru',
    date: 'Diumenge 12 — tarda',
    subtitle: 'L\'ensierru gran. ⚠️ El rol de Gallina NO és per a Rookies aquest any.',
    fields: [
      {
        type: 'single', id: 'ensierru', label: 'Com t\'agradaria participar-hi?',
        options: [
          { value: 'gallina', label: 'Gallina (Rookies no)' },
          { value: 'gall', label: 'Gall' },
          { value: 'carregador', label: 'Carregador/a' },
          { value: 'repartidor', label: 'Repartidor/a' },
          { value: 'encenedor', label: 'Encenedor/a' },
          { value: 'polvori', label: 'Polvorí' },
          { value: 'comentarista', label: 'Comentarista' },
          { value: 'paradeta', label: 'Paradeta marxandatge' },
          { value: 'seguretat', label: 'Seguretat' },
          { value: 'faci_falta', label: 'El que faci falta' },
          { value: 'no', label: 'No puc participar' },
        ],
      },
    ],
  },

  {
    id: 'sopar-idiotes-a',
    branch: A,
    icon: '🍔',
    title: 'Sopar dels Idiotes',
    date: 'Dilluns 13 — vespre',
    subtitle: 'Sopar de comiat. ⚠️ Si ets perfil 4, conta AQUÍ tota la família — no et tornarem a preguntar.',
    fields: [
      {
        type: 'number-picker', id: 'sopar_persones', label: 'Quantes persones vindreu al sopar?',
        min: 0, max: 8, options: ['No vindré', '1', '2', '3', '4', '5', '6', '7'],
      },
    ],
  },

  {
    id: 'ajuda-infantil',
    branch: [PROFILES.ADULT], // Només perfil 1 — el 4 ja contestarà rols com a tutor a les seccions infantils
    icon: '🐥',
    title: 'Ajuda als actes infantils',
    subtitle: 'Opcional. Només si vols col·laborar als actes de Polls Folls.',
    fields: [
      {
        type: 'multi', id: 'ajuda_infantil', label: 'A quins actes vols ajudar?',
        options: [
          { value: 'cercavila_infantil', label: 'Cercavila Infantil (Dilluns 13)' },
          { value: 'ensierru_infantil', label: 'Ensierru Infantil (Dilluns 13)' },
          { value: 'no', label: 'No podré' },
        ],
      },
    ],
  },

  {
    id: 'vestits-a',
    branch: A,
    icon: '👘',
    title: 'Vestits de diables',
    subtitle: 'Necessitem saber si tens vestit propi o n\'has de demanar un de la Colla.',
    fields: [
      {
        type: 'single', id: 'casaca', label: 'Tens casaca pròpia?',
        hint: 'Casaca = la peça de dalt amb el dimoni.',
        options: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }],
      },
      {
        type: 'single', id: 'peto', label: 'Tens peto propi?',
        hint: 'Peto = els pantalons / granota.',
        options: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }],
      },
      {
        type: 'single', id: 'talla_casaca', label: 'Si necessites casaca, quina talla et va bé?',
        hint: 'Deixa-ho a «No necessito» si ja tens casaca pròpia.',
        showIf: (s) => s.casaca === 'no',
        options: [
          { value: 'SP', label: 'SP (S)' },
          { value: 'P', label: 'P (M)' },
          { value: 'M', label: 'M (L)' },
          { value: 'G', label: 'G (XXL)' },
          { value: 'cap', label: 'No necessito' },
        ],
      },
    ],
  },

  {
    id: 'fede-a',
    branch: A,
    icon: '🎐',
    title: 'Organització de La Fede',
    subtitle: 'Tasques de suport organitzatiu (no vinculades al foc).',
    fields: [
      {
        type: 'multi', id: 'fede_adult', label: 'En quines tasques pots col·laborar?',
        options: [
          { value: 'esmorzar', label: 'Esmorzar Cercavila Adult (parar/desparar taules)' },
          { value: 'cercavila_adult', label: 'Cercavila Adult diumenge (acompanyar les colles)' },
          { value: 'cercavila_inf', label: 'Cercavila Infantil dilluns (preparar berenar)' },
          { value: 'no', label: 'No podré' },
        ],
      },
    ],
  },

  // ─── BRANCA C: pare/mare PF no membre (perfil 3) ───
  {
    id: 'pare-data',
    branch: C,
    icon: '👤',
    title: 'Les teves dades',
    subtitle: 'Recopilem les teves dades com a pare/mare. Després passarem a l\'infant.',
    fields: [
      { type: 'text', id: 'adult_name', label: 'Nom i cognoms', required: true },
      { type: 'email', id: 'adult_email', label: 'Adreça electrònica', required: true },
      { type: 'allergies', id: 'adult_alergies', label: 'Intoleràncies o al·lèrgies' },
    ],
  },
  {
    id: 'pare-cercatapes',
    branch: C,
    icon: '🍛',
    title: 'Cercatapes (acompanyant)',
    date: 'Dissabte 11 de juliol',
    subtitle: 'Indica si TU com a adult vindràs.',
    fields: [
      {
        type: 'single', id: 'cercatapes_a', label: 'Vols participar-hi com a adult?',
        options: [{ value: 'si', label: 'Sí, hi vull anar' }, { value: 'no', label: 'No, no puc' }],
      },
    ],
  },
  {
    id: 'pare-fede',
    branch: C,
    icon: '🎐',
    title: 'Organització de La Fede',
    subtitle: 'Tasques de suport (no foc). Pots col·laborar?',
    fields: [
      {
        type: 'multi', id: 'fede_adult', label: 'En quines tasques pots col·laborar?',
        options: [
          { value: 'esmorzar', label: 'Esmorzar Cercavila Adult' },
          { value: 'cercavila_adult', label: 'Cercavila Adult diumenge' },
          { value: 'cercavila_inf', label: 'Cercavila Infantil dilluns' },
          { value: 'no', label: 'No podré' },
        ],
      },
    ],
  },

  // ─── BRANCA B: infant ───
  {
    id: 'infant-data',
    branch: B,
    icon: '🧒',
    title: 'Dades del Poll Foll',
    subtitle: 'Un formulari per cada infant. Si en tens dos, l\'ompliràs dues vegades.',
    fields: [
      { type: 'text', id: 'infant_name', label: 'Nom i cognoms de l\'infant', required: true },
      { type: 'allergies', id: 'infant_alergies', label: 'Intoleràncies de l\'INFANT' },
      { type: 'text', id: 'tutor1_name', label: 'Nom i cognoms del tutor/a legal 1', required: true },
      { type: 'allergies', id: 'tutor1_alergies', label: 'Intoleràncies del tutor/a 1' },
      { type: 'text', id: 'tutor2_name', label: 'Nom i cognoms del tutor/a legal 2 (opcional)' },
      { type: 'allergies', id: 'tutor2_alergies', label: 'Intoleràncies del tutor/a 2 (opcional)' },
      {
        type: 'single', id: 'primer_familia',
        label: 'És aquest el primer formulari que omples per a aquesta família?',
        hint: 'IMPORTANT per evitar duplicats. Tria «No» si ja has omplert el formulari abans (per a un altre infant, o com a membre adult amb el perfil 4). Així no et tornarem a preguntar sopar / vestits / Fede del tutor.',
        required: true,
        options: [
          { value: 'si', label: 'Sí, és el primer formulari per a aquesta família', emoji: '✅' },
          { value: 'no', label: 'No, ja he omplert abans (un altre infant o com a adult)', emoji: '↩️' },
        ],
      },
    ],
  },

  {
    id: 'cercagallines-i',
    branch: B,
    icon: '🐔',
    title: 'Cercagallines (infant)',
    date: 'Divendres 10 de juliol',
    fields: [
      {
        type: 'single', id: 'cercagallines_infant', label: 'Com t\'agradaria participar-hi?',
        options: [
          { value: 'balcons', label: 'Estar a balcons' },
          { value: 'faci_falta', label: 'El que faci falta' },
          { value: 'no', label: 'No puc assistir-hi' },
        ],
      },
    ],
  },

  {
    id: 'cercatapes-i',
    branch: B,
    icon: '🍛',
    title: 'Cercatapes (infant)',
    date: 'Dissabte 11 de juliol',
    fields: [
      {
        type: 'single', id: 'cercatapes_infant', label: 'L\'infant hi participarà?',
        options: [
          { value: 'si', label: 'Sí, participarà' },
          { value: 'no', label: 'No participarà' },
        ],
      },
      {
        type: 'single', id: 'cercatapes_adults_familia', label: 'Quants adults de la família hi participareu?',
        hint: 'Si ets perfil 4 i ja has contestat al bloc adult, tria «Ja contestat al bloc adult».',
        options: [
          { value: 'cap', label: 'Cap' },
          { value: '1', label: '1 adult' },
          { value: '2', label: '2 adults' },
          { value: 'ja_contestat', label: 'Ja he contestat al bloc adult' },
        ],
        showIf: (s) => s.profile !== 'adult', // sempre dins de B
      },
    ],
  },

  {
    id: 'correfoc-infantil',
    branch: B,
    icon: '🔥',
    title: 'Correfoc infantil',
    date: 'Dissabte 11 de juliol',
    subtitle: 'Rol de l\'infant, rol dels tutors, i entrepans del sopar.',
    fields: [
      {
        type: 'single', id: 'correfoc_inf_infant', label: '[Infant] Què voldrà fer?',
        options: [
          { value: 'cremador', label: 'Cremador/a' },
          { value: 'tabaler', label: 'Tabaler/a' },
          { value: 'no', label: 'No hi podrà participar' },
        ],
      },
      {
        type: 'single', id: 'correfoc_inf_tutor1', label: '[Tutor 1] Com vol ajudar al correfoc infantil?',
        hint: 'Si ets perfil 4 i ja has contestat al bloc adult, tria «Ja contestat al bloc adult».',
        options: rolsTutorCorrefoc(true),
      },
      {
        type: 'single', id: 'correfoc_inf_tutor2', label: '[Tutor 2] Com vol ajudar? (opcional)',
        hint: 'Només si hi ha un segon tutor.',
        options: rolsTutorCorrefoc(false),
      },
      {
        type: 'single', id: 'sopar_correfoc_infant', label: 'SOPAR — Entrepà per a l\'INFANT?',
        options: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }],
      },
      {
        type: 'single', id: 'sopar_correfoc_tutor1', label: 'SOPAR — Entrepà per al TUTOR 1?',
        hint: 'Si ets perfil 4 i ja has contestat al bloc adult, tria l\'opció.',
        options: [
          { value: 'si', label: 'Sí, en vull' },
          { value: 'no', label: 'No, no en vull' },
          { value: 'ja_contestat', label: 'Ja he contestat al bloc adult' },
        ],
      },
      {
        type: 'single', id: 'sopar_correfoc_tutor2', label: 'SOPAR — Entrepà per al TUTOR 2? (opcional)',
        options: [
          { value: 'si', label: 'Sí, en vull' },
          { value: 'no', label: 'No, no en vull' },
          { value: 'no_tutor2', label: 'No hi ha tutor 2' },
        ],
      },
    ],
  },

  {
    id: 'cercavila-infantil',
    branch: B,
    icon: '💃',
    title: 'Cercavila Infantil',
    date: 'Dilluns 13 — tarda',
    fields: [
      {
        type: 'single', id: 'cercavila_inf_infant', label: '[Infant] Què voldrà fer?',
        options: [
          { value: 'pollet', label: 'Pollet (ballar i cremar 2 vegades)' },
          { value: 'ramoneta', label: 'Ramoneta (ballar amb els pollets)' },
          { value: 'tabaler', label: 'Tabaler/a' },
          { value: 'no', label: 'No participarà' },
        ],
      },
    ],
  },

  {
    id: 'ensierru-infantil',
    branch: B,
    icon: '🐣',
    title: 'Ensierru infantil',
    date: 'Dilluns 13 — vespre',
    fields: [
      {
        type: 'single', id: 'ensierru_inf_infant', label: 'L\'infant participarà com…',
        options: [
          { value: 'pollet', label: 'Pollet (11 a 13 anys)' },
          { value: 'gallina', label: 'Gallina (14 a 17 anys)' },
          { value: 'no', label: 'No participarà' },
        ],
      },
      {
        type: 'single', id: 'ensierru_inf_tutor1', label: '[Tutor 1] Com vol ajudar a l\'ensierru infantil?',
        options: rolsTutorEnsierru(true),
      },
      {
        type: 'single', id: 'ensierru_inf_tutor2', label: '[Tutor 2] Com vol ajudar? (opcional)',
        options: rolsTutorEnsierru(false),
      },
    ],
  },

  // ─── Sopar i Fede família — només si primer_familia === 'si' ───
  {
    id: 'sopar-idiotes-familia',
    branch: B,
    showIf: (s) => s.primer_familia === 'si',
    icon: '🍔',
    title: 'Sopar dels Idiotes (família)',
    date: 'Dilluns 13 — vespre',
    subtitle: 'Responeu UN SOL COP per família.',
    fields: [
      {
        type: 'number-picker', id: 'sopar_persones_familia', label: 'Quantes persones de la família vindreu al sopar?',
        min: 0, max: 8, options: ['Ningú', '1', '2', '3', '4', '5', '6', '7'],
      },
    ],
  },

  {
    id: 'vestits-tutor',
    branch: B,
    showIf: (s) => s.primer_familia === 'si',
    icon: '👘',
    title: 'Vestits i Fede del tutor',
    subtitle: 'Si ets perfil 4 i ja has contestat al bloc adult, tria «Ja contestat al bloc adult».',
    fields: [
      {
        type: 'single', id: 'casaca_tutor', label: '[Tutor 1] Té casaca pròpia?',
        options: [
          { value: 'si', label: 'Sí' },
          { value: 'no', label: 'No' },
          { value: 'ja_contestat', label: 'Ja he contestat al bloc adult' },
        ],
      },
      {
        type: 'single', id: 'peto_tutor', label: '[Tutor 1] Té peto propi?',
        options: [
          { value: 'si', label: 'Sí' },
          { value: 'no', label: 'No' },
          { value: 'ja_contestat', label: 'Ja he contestat al bloc adult' },
        ],
      },
      {
        type: 'multi', id: 'fede_tutor', label: '[Tutor 1] Pot col·laborar a La Fede en:',
        options: [
          { value: 'esmorzar', label: 'Esmorzar Cercavila Adult' },
          { value: 'cercavila_adult', label: 'Cercavila Adult diumenge' },
          { value: 'cercavila_inf', label: 'Cercavila Infantil dilluns' },
          { value: 'no', label: 'No podré' },
          { value: 'ja_contestat', label: 'Ja he contestat al bloc adult' },
        ],
      },
    ],
  },
];

function rolsTutorCorrefoc(includeJaContestat) {
  const base = [
    { value: 'encenedor', label: 'Encenedor/a' },
    { value: 'carregador', label: 'Carregador/a' },
    { value: 'descarregador', label: 'Descarregador/a' },
    { value: 'monjo', label: 'Monjo/a' },
    { value: 'polvori', label: 'Polvorí' },
    { value: 'carro_aigua', label: 'Carro Aigua' },
    { value: 'linia_vida', label: 'Línia de vida' },
    { value: 'linia_seguretat', label: 'Línia de seguretat' },
    { value: 'gestio_convidada', label: 'Gestió colla convidada' },
  ];
  if (includeJaContestat) base.push({ value: 'ja_contestat', label: 'Ja he contestat al bloc adult' });
  base.push({ value: 'no', label: 'No podré participar' });
  return base;
}

function rolsTutorEnsierru(includeJaContestat) {
  const base = [
    { value: 'carregador', label: 'Carregador/a' },
    { value: 'pastor', label: 'Pastor/a' },
    { value: 'encenedor', label: 'Encenedor/a' },
    { value: 'polvori', label: 'Polvorí' },
    { value: 'repartidor', label: 'Repartidor/a' },
    { value: 'necessiteu', label: 'El que necessiteu' },
  ];
  if (includeJaContestat) base.push({ value: 'ja_contestat', label: 'Ja he contestat al bloc adult' });
  base.push({ value: 'no', label: 'No podré participar' });
  return base;
}

// Filtre de passos visibles segons perfil i state actual
export function visibleSteps(profile, state) {
  return STEPS.filter((s) => {
    if (s.branch === 'all') return true;
    if (!s.branch.includes(profile)) return false;
    if (s.showIf && !s.showIf({ ...state, profile })) return false;
    return true;
  });
}
