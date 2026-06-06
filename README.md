# 🔥 La Llagastada 2026 — App d'inscripcions

Aplicació Next.js per a les inscripcions a la Festa Major d'Estiu d'Esparreguera (Colla de Diables, 30è aniversari). Substitueix el Google Form i escriu les respostes directament a un Google Sheets organitzat per acte.

![Banner](public/header.jpg)

## ✨ Característiques

- **4 perfils** amb flux condicional: només es fan les preguntes que toquen
- **UX moderna** amb React, Tailwind i Framer Motion — barra de progrés, animacions suaus
- **Mòbil first** — perfecte des del telèfon
- **Sense duplicats**: la lògica de "primer formulari de la família" + "Ja contestat al bloc adult" elimina els problemes del Google Form
- **Backend a Apps Script** que escriu a múltiples fulls organitzats per acte (no cal feina manual de merge)
- **Full RESUM** que es regenera automàticament a cada nova inscripció

## 🚀 Posada en marxa

### 1) Backend (Google Apps Script)

1. Crea un nou Google Sheet on vulguis les inscripcions
2. Extensions → Apps Script
3. Enganxa el contingut de `apps-script/Code.gs`
4. **Desplega → Nova implementació**
   - Tipus: **Aplicació web**
   - Executar com: **jo mateix**
   - Qui hi té accés: **Qualsevol**
5. Copia la URL acabada en `/exec`

### 2) Frontend (local)

```bash
cd llagastada-app
npm install
cp .env.example .env.local
# edita .env.local i posa APPS_SCRIPT_URL=la-teva-url
npm run dev
```

Obre [http://localhost:3000](http://localhost:3000).

### 3) Desplegament a Vercel

```bash
npm i -g vercel
vercel
```

A Vercel afegeix la variable d'entorn `APPS_SCRIPT_URL` amb la URL del web app.

## 📊 Estructura del Google Sheet

L'Apps Script crea automàticament aquests fulls:

| Full | Contingut |
|---|---|
| `RESUM` | Comptadors agregats (es regenera a cada submissió) |
| `RAW` | Resposta completa en JSON (1 fila per submissió) |
| `ADULTS` | 1 fila per adult registrat |
| `INFANTS` | 1 fila per infant registrat |
| `CERCAVILA_ALT`, `CERCAGALLINES`, `CERCATAPES`, `TEATRE`, `CORREFOC`, `ENSIERRU_MATINER`, `CERCAVILA_DIUM`, `ENSIERRU` | Actes adult |
| `CERCAGALLINES_INF`, `CERCATAPES_INF`, `CORREFOC_INF`, `CERCAVILA_INF`, `ENSIERRU_INF` | Actes infantils |
| `SOPAR_IDIOTES`, `VESTITS`, `FEDE` | Agregats globals |

Cada full té capçaleres en taronja Llagasta (#FF5C00). Pots filtrar i ordenar lliurement.

## 🛠️ Personalització

### Textos i preguntes
Edita `lib/schema.js`. Cada secció és un objecte amb `id`, `branch`, `icon`, `title`, `date`, `subtitle`, `fields[]`.

### Colors
Edita `tailwind.config.js` → `colors.brand`.

### Capçalera
Substitueix `public/header.jpg` pel disseny actual.

### Dates dels actes
Cerca i substitueix als `date:` dins `lib/schema.js`.

## 📂 Arquitectura

```
llagastada-app/
├─ app/
│  ├─ layout.jsx
│  ├─ page.jsx              # Intro + Wizard
│  ├─ globals.css
│  └─ api/submit/route.js   # Proxy a Apps Script
├─ components/
│  ├─ Header.jsx            # Banner amb capçalera
│  ├─ Wizard.jsx            # Estat + navegació entre passos
│  ├─ Fields.jsx            # Camps reutilitzables
│  └─ ProgressBar.jsx
├─ lib/
│  └─ schema.js             # Definició declarativa de tot el formulari
├─ apps-script/
│  └─ Code.gs               # Backend Google Apps Script
└─ public/
   └─ header.jpg
```

## 🔥 Salut i foc
