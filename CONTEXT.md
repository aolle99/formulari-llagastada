# Context del projecte — La Llagastada 2026

> Document de context per continuar el desenvolupament des de Claude Code.
> Generat a partir d'una conversa de disseny amb Claude.

## 👤 Sobre l'usuari i context

- **Nom**: Àlex
- **Organització**: Colla de Diables d'Esparreguera (30è aniversari)
- **Llengua**: Català (preferent), també castellà i anglès
- **Rol a la colla**: producció, gestió d'àudio, coordinació administrativa, performance, gestió burocràtica (subvencions, actes de reunió)
- **Stack que ja usa**: Google Apps Script, Vercel, AppSheet, Google Forms/Sheets
- **Experiència prèvia**: ha creat sistemes d'email automàtic amb Google Forms + Apps Script + Vercel; explorat WhatsApp bots amb whatsapp-web.js; producció de l'espectacle "El naixement de l'Ígnia"

## 🎯 El problema original

El formulari d'inscripcions a la Festa Major (La Llagastada, 9-13 de juliol) es feia amb Google Forms. Tenia 4 casuístiques de socis:

1. **Membre adult** (només participa a actes adults)
2. **Infant Polls Folls** (un infant de la colla infantil)
3. **Pare/mare de Poll Foll** (no membre adult)
4. **Pare PF + membre adulta** (combinació)

**Problemes amb Google Forms:**
- Forms no té lògica condicional real entre seccions → s'havien de duplicar preguntes
- Generava **duplicats** al sopar dels idiotes, vestits i Fede (un pare PF + adult omplia el formulari 2 cops i comptava 2 vegades)
- Calia molta feina manual de merge i neteja al spreadsheet
- L'opció "Sóc mare/pare de Polls Folls" com a checkbox dins el bloc adult era ambígua
- Una opció "Ja he respost al formulari de la colla infantil" reflectia la confusió

## 🛠️ Solució escollida

Després d'explorar 4 opcions (Forms refet, Forms + Apps Script normalitzador, Typeform/Tally, app web pròpia), es va decidir fer una **app web pròpia amb Next.js + Tailwind + Vercel** perquè:

- Google Forms via Apps Script no permet markdown ni formats rics → els formularis quedaven plans i poc atractius
- El control total sobre el flux condicional elimina els duplicats per disseny (no per pegat)
- La sortida al Google Sheets ja queda organitzada per acte, sense feina manual

### Mecanismes anti-duplicats clau

1. **Pregunta de perfil a S0** → cada perfil té el seu propi flux
2. **Pregunta "És el primer formulari per a aquesta família?"** (a B1) → si és el segon infant d'una família, NO es tornen a preguntar sopar/vestits/Fede del tutor
3. **Opció "Ja he contestat al bloc adult"** als rols/entrepans dels tutors (per al perfil 4)

## 📦 Estat actual del projecte

L'usuari ja té el codi entregat com a `llagastada-app.tar.gz`. És una app Next.js 14 (app router, JSX, no TypeScript) amb:

### Estructura

```
llagastada-app/
├─ app/
│  ├─ layout.jsx              # Layout root amb metadata
│  ├─ page.jsx                # Home: Header + Intro + Wizard + Footer
│  ├─ globals.css             # Tailwind + classes utilitàries (btn-primary, choice, etc.)
│  └─ api/submit/route.js     # POST que fa proxy a Apps Script
├─ components/
│  ├─ Header.jsx              # Bàner amb /public/header.jpg
│  ├─ Wizard.jsx              # Estat global, navegació entre passos, validació, submit
│  ├─ Fields.jsx              # Camps reutilitzables (Text, Single, Multi, Allergies, NumberPicker, ProfileCards)
│  └─ ProgressBar.jsx         # Barra de progrés gradient
├─ lib/
│  └─ schema.js               # Definició DECLARATIVA del formulari sencer
├─ apps-script/
│  └─ Code.gs                 # Backend que rep JSON i escriu a Sheets organitzat per acte
├─ public/
│  └─ header.jpg              # Capçalera oficial (1255 KB)
├─ package.json
├─ tailwind.config.js         # Brand color #FF5C00 (taronja Llagasta)
├─ postcss.config.js
├─ next.config.js
├─ .env.example               # APPS_SCRIPT_URL
├─ .gitignore
└─ README.md
```

### Stack tècnic

- **Next.js 14.2.5** amb app router
- **React 18.3.1** (JSX, no TS)
- **Tailwind 3.4.7** amb paleta brand personalitzada
- **Framer Motion 11.3.19** per a animacions entre passos
- **Lucide React 0.408.0** per a icones
- **clsx 2.1.1** (instal·lat però poc usat)

### Disseny visual

- **Color primari**: `#FF5C00` (taronja Llagasta) — definit a Tailwind com `brand-500`
- **Paleta brand**: ofereix tota la gamma `brand-50` a `brand-900`
- **Paleta secundària**: `ash-50` a `ash-900` (grisos càlids tipo stone)
- **Tipografia**: Inter de Google Fonts
- **Estètica**: cards arrodonides (rounded-2xl), ombres suaus, espaiat generós, mobile-first
- **Animacions**: fade + slide al canviar de pas, escala al succés

## 🗂️ Concepte central: `lib/schema.js`

És el cor de l'app. Defineix declarativament TOTS els passos del formulari com a array d'objectes. El Wizard llegeix aquest array i renderitza generadorament. Per modificar el formulari, NORMALMENT només cal tocar aquest fitxer.

### Estructura d'un step

```js
{
  id: 'cercavila-alt',           // identificador únic
  branch: A,                     // qui veu aquest step (vegeu branques sota)
  icon: '🙏',                    // emoji a la capçalera
  title: 'Cercavila Alternativa',
  date: 'Dijous 9 de juliol',    // opcional, mostra "chip" amb data
  subtitle: '...',               // text descriptiu sota el títol
  showIf: (state) => ...,        // opcional, condició de visibilitat
  fields: [
    {
      type: 'single',            // 'text', 'email', 'single', 'multi', 'allergies', 'number-picker', 'profile-cards'
      id: 'cercavila_alt',
      label: '...',
      hint: '...',
      required: true,            // opcional
      options: [{ value, label, emoji }, ...],
      showIf: (state) => ...,    // opcional, condició a nivell de camp
    }
  ]
}
```

### Branques

```js
const A = [PROFILES.ADULT, PROFILES.PARE_ADULT];                // bloc adult
const B = [PROFILES.INFANT, PROFILES.PARE, PROFILES.PARE_ADULT]; // bloc infant
const C = [PROFILES.PARE];                                       // dades pare/mare no membre
```

- `branch: 'all'` → visible per a tots els perfils
- `branch: A` → només per a perfils que veuen seccions adultes
- etc.

### Funció clau

```js
visibleSteps(profile, state)  // retorna array filtrat segons perfil i state actual
```

## 🔧 Components clau

### `Wizard.jsx`

Gestiona:
- Estat global (`state` amb totes les respostes acumulades, indexat per field.id)
- Step actual (`stepIndex`)
- Llista dinàmica de steps visibles (es recalcula a cada canvi)
- Validació (camps required + format email)
- Submit (POST a `/api/submit`)
- Pantalla d'èxit amb opció **"Apuntar un altre infant"** que preserva dades del tutor i seteja `primer_familia='no'`

### `Fields.jsx`

Components: `TextField`, `SingleChoice`, `MultiChoice`, `Allergies` (chips), `NumberPicker` (grid), `ProfileCards` (4 cards grans), `FieldRenderer` (switch genèric)

### `api/submit/route.js`

POST → reenvia el JSON tal qual al `APPS_SCRIPT_URL` (variable d'entorn).

### `apps-script/Code.gs`

Backend al Google Sheet. Rep el JSON i el descomposa en múltiples fulls:

- `RESUM` (regenerat a cada submit, capçalera taronja)
- `RAW` (1 fila per submit, JSON sencer)
- `ADULTS`, `INFANTS` (un registre per persona)
- Un full per cada acte: `CERCAVILA_ALT`, `CERCAGALLINES`, `CERCATAPES`, `TEATRE`, `CORREFOC`, `ENSIERRU_MATINER`, `CERCAVILA_DIUM`, `ENSIERRU`, `CERCAGALLINES_INF`, `CERCATAPES_INF`, `CORREFOC_INF`, `CERCAVILA_INF`, `ENSIERRU_INF`
- Agregats: `SOPAR_IDIOTES`, `VESTITS`, `FEDE`

Cada participant a un acte = 1 fila amb columnes `Timestamp, Nom, Rol` (i específiques de l'acte). Els fulls es creen automàticament a la primera escriptura.

### Mapeig values → etiquetes

`Code.gs` té una constant `L` amb diccionaris per traduir valors interns (`cremador`) a etiquetes humanes (`Cremador/a`) per cada acte.

## 🚀 Setup que l'usuari ha de fer

1. **Backend**:
    - Crear Google Sheet buit
    - Extensions → Apps Script → enganxar `apps-script/Code.gs`
    - Desplega → Aplicació web (executar com a mi mateix, accés qualsevol)
    - Copiar URL `/exec`

2. **Local**:
   ```bash
   tar xzf llagastada-app.tar.gz
   cd llagastada-app
   npm install
   cp .env.example .env.local
   # editar .env.local amb APPS_SCRIPT_URL
   npm run dev
   ```

3. **Vercel**:
   ```bash
   vercel
   ```
   Afegir `APPS_SCRIPT_URL` com a variable d'entorn al dashboard.

## 💡 Coses pendents / millores possibles

L'usuari va comentar que té **imatges potents dels actes** que es podrien afegir més endavant. Per implementar-ho:

1. Posar les imatges a `/public/actes/` (p. ex. `correfoc.jpg`, `cercagallines.jpg`)
2. Afegir camp `image: '/actes/correfoc.jpg'` als steps de `lib/schema.js`
3. Modificar `StepHeader` a `Wizard.jsx` per renderitzar la imatge entre el títol i les preguntes

Altres millores possibles:
- **Edició de resposta** (link tornar a editar enviat per email)
- **Confirmació per email** (l'usuari ja té sistema d'email amb Apps Script — es pot reutilitzar)
- **Llistes d'admin amb autenticació** (vista que llegeixi els fulls i mostri quants hi ha per acte)
- **Validació de límits per rol** (si un rol està saturat, oferir alternatives o avisar)
- **Notificacions WhatsApp** quan algú s'apunta (l'usuari ja explorava whatsapp-web.js)
- **Mode dark** (poc prioritari)
- **Versió impresa o PDF** del llistat per acte per als coordinadors

## ⚠️ Detalls importants a tenir present

### Anti-duplicats (lògica crítica)

```js
// A Code.gs:
function esPrimeraVegadaFamilia_(p) {
  if (p.profile === 'adult' || p.profile === 'pare_adult' || p.profile === 'pare') return true;
  return p.primer_familia === 'si';
}
```

- Si és **perfil 1 (adult)**: sempre s'apunta com a adult, no té dades de família
- Si és **perfil 3 o 4**: és el primer cop que aquesta persona apareix, sempre s'apunta com a adult
- Si és **perfil 2 (infant)**: només compta sopar/vestits/Fede si `primer_familia === 'si'`

### Reset per "Apuntar un altre infant"

A `Wizard.jsx`, la funció `resetForAnother` preserva nom dels tutors, intoleràncies dels tutors, i seteja `profile='infant'` + `primer_familia='no'` automàticament. Així el segon infant es marca correctament com a NO primer de família.

### Headers de Sheets

Els fulls es creen amb capçalera taronja (`#FF5C00`) i text blanc en negreta. Frozen row 1.

## 🎨 Detalls visuals importants

- La **capçalera** (`/public/header.jpg`) és el bàner oficial proporcionat per l'usuari, mostra "30 anys Diables Esparreguera", logo "Polls Folls", el centaure de La Llagastada, "Festa Major Estiu 2026" amb foc al fons
- La **secció Intro** explica la llegenda de Sant Llagasta amb format de targeta gradient
- Els **chips** ("🔥 30è aniversari", "9-13 de juliol") es fan amb la classe `.chip` de globals.css
- La pantalla de **success** té un círcol gradient brand amb checkmark gros, i 2 botons (apuntar un altre infant / tornar a començar)
- El **footer** acaba amb "Salut i foc 🔥" en cursiva

## 📋 Convencions de codi

- **JSX** sense TypeScript (per simplicitat)
- **Imports absoluts** amb `@/` (Next.js path mapping al `jsconfig.json` — atenció: NO l'he creat encara, potser cal afegir-lo o canviar imports a relatius)
- **Tailwind utilities** amb classes utilitàries definides a `globals.css` (`.btn-primary`, `.choice`, `.input`, `.card`, `.chip`)
- **Animacions** amb `framer-motion` (AnimatePresence + motion.div amb `key={step.id}`)
- **Estat** simple amb `useState` al Wizard, sense Redux/Zustand
- **`use client`** a tots els components amb interactivitat

## 🐛 Possible problema conegut

**Imports `@/`**: Next.js no resol `@/` automàticament sense configuració. Si fa fallar la build, cal crear `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

O substituir tots els `import ... from '@/...'` per imports relatius.

## 📝 Conversa anterior (resum)

1. Vam analitzar el formulari Google Forms 2025 actual (63 preguntes, perfil binari Adulta/Infantil amb opcions de "Ja he respost al formulari de la colla infantil" per pegat)
2. Vam dissenyar les 4 tipologies + flux condicional amb un docx de disseny
3. Vam fer un Apps Script normalitzador que llegia les respostes i les organitzava en fulls per acte (problemàtic: el Forms original era confús)
4. Vam fer un generador d'Apps Script que creava el Form sencer programàticament
5. Vam corregir un parell d'errors a la creació (array buit de choices, columnes insuficients al normalitzador)
6. L'usuari va dir que els Forms quedaven plans i poc intuïtius → vam pivotar a app web
7. Vam construir l'app Next.js completa amb la capçalera oficial + brand color #FF5C00

## 🎯 Què demanar a Claude Code

Suggeriments de tasques per continuar:

1. **Provar localment**: assegurar que `npm install && npm run dev` funciona sense errors. Probablement caldrà crear `jsconfig.json` o convertir imports.
2. **Afegir imatges als actes**: una vegada l'usuari proporcioni les imatges
3. **Construir vista d'admin**: que llegeixi del Google Sheet via Apps Script GET endpoint i mostri taules ordenades per acte
4. **Sistema d'edició de resposta**: enllaç únic per email que permet tornar a omplir/editar
5. **Integrar amb sistemes existents**: WhatsApp notifications, email automàtic (l'usuari ja té infraestructura)
6. **Test end-to-end**: crear inscripcions de prova per cada perfil i validar que arriben correctament als fulls del Sheet
7. **Audit responsive**: revisar el flux des de mòbil (cards de perfil, NumberPicker, etc.)
8. **Internacionalització** (poc prioritari): si volen versió castellana

## 🔥 Filosofia del projecte

- "Salut i foc" — to càlid i de colla
- Mobile-first sempre
- Cada decisió de UX ha de reduir confusió, no afegir-ne
- El Sheet final ha de ser **directament utilitzable pels coordinadors d'acte** sense feina manual
- L'usuari valora el control total sobre el codi (és tècnic, sap Apps Script i Vercel)

---

**Salut i foc 🔥**