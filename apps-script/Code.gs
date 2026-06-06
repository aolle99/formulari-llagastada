/**
 * BACKEND DE LA LLAGASTADA 2026 — Apps Script Web App
 *
 * Aquest script rep submissions JSON des de l'aplicació Vercel
 * i escriu directament als fulls organitzats per acte.
 *
 * DESPLEGAMENT:
 *   1) Crea un nou projecte a script.google.com vinculat al Sheet on vols les dades
 *   2) Enganxa aquest fitxer com a Code.gs
 *   3) Desplega → Nova implementació → Tipus: aplicació web
 *      ▸ Executar com: jo mateix (el teu compte)
 *      ▸ Qui hi té accés: qualsevol (perquè Vercel pugui cridar-lo)
 *   4) Copia la URL de desplegament (acaba en /exec)
 *   5) Posa-la a la variable d'entorn APPS_SCRIPT_URL a Vercel
 *
 * Cada inscripció genera files a:
 *   - RAW              (resposta completa, una fila per enviament)
 *   - ADULTS           (una fila per adult registrat)
 *   - INFANTS          (una fila per infant registrat)
 *   - actes individuals: CERCAVILA_ALT, CERCAGALLINES, CERCATAPES, TEATRE,
 *                        CORREFOC, ENSIERRU_MATINER, CERCAVILA_DIUM, ENSIERRU,
 *                        SOPAR_CORREFOC, SOPAR_IDIOTES, VESTITS, FEDE,
 *                        CERCAGALLINES_INF, CERCATAPES_INF, CORREFOC_INF,
 *                        CERCAVILA_INF, ENSIERRU_INF
 *   - RESUM            (taula de comptadors per acte i rol — es regenera)
 */

// ════════════════════════════════════════════════════════════════
//   ENDPOINT
// ════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    processaInscripcio_(payload);
    regeneraResum_();
    return out_({ ok: true });
  } catch (err) {
    Logger.log('ERROR: ' + err.message + '\n' + err.stack);
    return out_({ ok: false, error: err.message });
  }
}

function doGet() {
  return out_({ ok: true, message: 'Llagastada backend OK' });
}

function out_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ════════════════════════════════════════════════════════════════
//   PROCESSAMENT
// ════════════════════════════════════════════════════════════════

function processaInscripcio_(p) {
  const ts = p._ts || new Date().toISOString();
  const profile = p.profile;
  if (!profile) throw new Error('Falta el perfil');

  // 1) RAW
  appendRaw_(p, ts);

  // 2) Si hi ha dades d'adult, registra l'adult
  if (teAdult_(profile)) {
    afegeixAdult_(p, ts);
    processaActesAdult_(p, ts);
    if (esPrimeraVegadaFamilia_(p)) {
      processaSoparAdult_(p, ts);
      processaVestitsAdult_(p, ts);
      processaFedeAdult_(p, ts);
    } else {
      // Encara hi ha el bloc adult: si és perfil 1 sempre l'omple. Si és perfil 4 i família ja contestada... cas estrany; per ara registrem.
      processaSoparAdult_(p, ts);
      processaVestitsAdult_(p, ts);
      processaFedeAdult_(p, ts);
    }
  }

  // 3) Si hi ha dades d'infant, registra l'infant
  if (teInfant_(profile)) {
    afegeixInfant_(p, ts);
    processaActesInfant_(p, ts);
    if (esPrimeraVegadaFamilia_(p)) {
      processaSoparFamilia_(p, ts);
      processaVestitsTutor_(p, ts);
      processaFedeTutor_(p, ts);
    }
  }
}

function teAdult_(profile) {
  return profile === 'adult' || profile === 'pare_adult' || profile === 'pare';
}
function teInfant_(profile) {
  return profile === 'infant' || profile === 'pare_adult' || profile === 'pare';
}
function esPrimeraVegadaFamilia_(p) {
  if (p.profile === 'adult' || p.profile === 'pare_adult' || p.profile === 'pare') return true;
  return p.primer_familia === 'si';
}

// ════════════════════════════════════════════════════════════════
//   FULLS
// ════════════════════════════════════════════════════════════════

function getSheet_(name, headers) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (headers) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      sh.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#FF5C00')
        .setFontColor('#FFFFFF');
      sh.setFrozenRows(1);
    }
  }
  return sh;
}

function appendRow_(name, headers, row) {
  const sh = getSheet_(name, headers);
  sh.appendRow(row);
}

// ── RAW: una fila amb tot el JSON aplanat ────────────────────────
function appendRaw_(p, ts) {
  const sh = getSheet_('RAW');
  const headers = ['timestamp', 'profile', 'json'];
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold').setBackground('#1C1917').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  sh.appendRow([ts, p.profile, JSON.stringify(p)]);
}

// ── ADULTS i INFANTS ─────────────────────────────────────────────
function afegeixAdult_(p, ts) {
  const headers = ['Timestamp', 'Perfil', 'Nom', 'Email', 'Intoleràncies'];
  appendRow_('ADULTS', headers, [
    ts, p.profile,
    p.adult_name || '',
    p.adult_email || '',
    formatAlergies_(p.adult_alergies),
  ]);
}

function afegeixInfant_(p, ts) {
  const headers = ['Timestamp', 'Perfil', 'Nom infant', 'Intoleràncies infant', 'Tutor 1', 'Intol. Tutor 1', 'Tutor 2', 'Intol. Tutor 2', 'Primer formulari família'];
  appendRow_('INFANTS', headers, [
    ts, p.profile,
    p.infant_name || '',
    formatAlergies_(p.infant_alergies),
    p.tutor1_name || '',
    formatAlergies_(p.tutor1_alergies),
    p.tutor2_name || '',
    formatAlergies_(p.tutor2_alergies),
    p.primer_familia === 'si' ? 'Sí' : (p.primer_familia === 'no' ? 'No' : '—'),
  ]);
}

// ════════════════════════════════════════════════════════════════
//   ACTES ADULT
// ════════════════════════════════════════════════════════════════

function processaActesAdult_(p, ts) {
  const nom = p.adult_name || '';

  // Cercavila alternativa
  if (p.cercavila_alt === 'si') {
    appendRow_('CERCAVILA_ALT',
      ['Timestamp', 'Nom', 'Intoleràncies'],
      [ts, nom, formatAlergies_(p.adult_alergies)]);
  }

  // Cercagallines adult
  if (p.cercagallines_a && p.cercagallines_a !== 'no') {
    appendRow_('CERCAGALLINES',
      ['Timestamp', 'Nom', 'Rol'],
      [ts, nom, labelCercagallines_(p.cercagallines_a)]);
  }

  // Cercatapes adult
  if (p.cercatapes_a === 'si') {
    appendRow_('CERCATAPES',
      ['Timestamp', 'Nom', 'Intoleràncies'],
      [ts, nom, formatAlergies_(p.adult_alergies)]);
  }

  // Teatre
  if (p.teatre && p.teatre !== 'no') {
    appendRow_('TEATRE',
      ['Timestamp', 'Nom', 'Rol'],
      [ts, nom, labelTeatre_(p.teatre)]);
  }

  // Correfoc
  if (p.correfoc && p.correfoc !== 'no') {
    appendRow_('CORREFOC',
      ['Timestamp', 'Nom', 'Rol', 'Entrepà sopar'],
      [ts, nom, labelCorrefoc_(p.correfoc), p.sopar_correfoc === 'si' ? 'Sí' : 'No']);
  } else if (p.sopar_correfoc === 'si') {
    // Vol entrepà però no participa al correfoc
    appendRow_('CORREFOC',
      ['Timestamp', 'Nom', 'Rol', 'Entrepà sopar'],
      [ts, nom, '—', 'Sí']);
  }

  // Ensierru matiner
  if (p.ensierru_matiner && p.ensierru_matiner !== 'no') {
    appendRow_('ENSIERRU_MATINER',
      ['Timestamp', 'Nom', 'Rol', 'Esmorzar'],
      [ts, nom, labelEnsierruMatiner_(p.ensierru_matiner), p.esmorzar_matiner === 'si' ? 'Sí' : 'No']);
  }

  // Cercavila diumenge
  if (p.cercavila_diumenge && p.cercavila_diumenge !== 'no') {
    appendRow_('CERCAVILA_DIUM',
      ['Timestamp', 'Nom', 'Rol', 'Esmorzar'],
      [ts, nom, labelCercavilaDium_(p.cercavila_diumenge), p.esmorzar_cercavila === 'si' ? 'Sí' : 'No']);
  }

  // Ensierru
  if (p.ensierru && p.ensierru !== 'no') {
    appendRow_('ENSIERRU',
      ['Timestamp', 'Nom', 'Rol'],
      [ts, nom, labelEnsierru_(p.ensierru)]);
  }
}

function processaSoparAdult_(p, ts) {
  const n = parseInt(p.sopar_persones || '0', 10);
  if (!n) return;
  appendRow_('SOPAR_IDIOTES',
    ['Timestamp', 'Nom de qui apunta', 'Tipus', 'Persones', 'Intoleràncies'],
    [ts, p.adult_name || '', 'Adult / família (perfil ' + p.profile + ')', n, formatAlergies_(p.adult_alergies)]);
}

function processaVestitsAdult_(p, ts) {
  if (!p.casaca && !p.peto) return;
  appendRow_('VESTITS',
    ['Timestamp', 'Nom', 'Tipus', 'Casaca pròpia', 'Peto propi', 'Talla casaca si demana'],
    [ts, p.adult_name || '', 'Adult',
     p.casaca === 'si' ? 'Sí' : (p.casaca === 'no' ? 'No' : '—'),
     p.peto === 'si' ? 'Sí' : (p.peto === 'no' ? 'No' : '—'),
     p.casaca === 'no' ? (p.talla_casaca || '') : '']);
}

function processaFedeAdult_(p, ts) {
  const sel = (p.fede_adult || []).filter((v) => v !== 'no');
  if (sel.length === 0) return;
  appendRow_('FEDE',
    ['Timestamp', 'Nom', 'Tipus', 'Esmorzar', 'Cercavila Adult', 'Cercavila Infantil'],
    [ts, p.adult_name || '', 'Adult',
     sel.includes('esmorzar') ? '✓' : '',
     sel.includes('cercavila_adult') ? '✓' : '',
     sel.includes('cercavila_inf') ? '✓' : '']);
}

// ════════════════════════════════════════════════════════════════
//   ACTES INFANTILS
// ════════════════════════════════════════════════════════════════

function processaActesInfant_(p, ts) {
  const infant = p.infant_name || '';
  const tutor1 = p.tutor1_name || '';
  const tutor2 = p.tutor2_name || '';

  // Cercagallines infant
  if (p.cercagallines_infant && p.cercagallines_infant !== 'no') {
    appendRow_('CERCAGALLINES_INF',
      ['Timestamp', 'Infant', 'Rol'],
      [ts, infant, labelCercagallinesInf_(p.cercagallines_infant)]);
  }

  // Cercatapes infant
  if (p.cercatapes_infant === 'si') {
    appendRow_('CERCATAPES_INF',
      ['Timestamp', 'Infant', 'Adults família', 'Intoleràncies infant'],
      [ts, infant,
       p.cercatapes_adults_familia === 'ja_contestat' ? 'Ja contestat al bloc adult' :
         (p.cercatapes_adults_familia === 'cap' ? '0' :
          (p.cercatapes_adults_familia === '1' ? '1' :
           (p.cercatapes_adults_familia === '2' ? '2' : '—'))),
       formatAlergies_(p.infant_alergies)]);
  }

  // Correfoc infantil
  if ((p.correfoc_inf_infant && p.correfoc_inf_infant !== 'no') ||
      (p.correfoc_inf_tutor1 && !['no', 'ja_contestat'].includes(p.correfoc_inf_tutor1)) ||
      (p.correfoc_inf_tutor2 && p.correfoc_inf_tutor2 !== 'no')) {
    appendRow_('CORREFOC_INF',
      ['Timestamp', 'Infant', 'Rol infant',
       'Tutor 1', 'Rol tutor 1', 'Tutor 2', 'Rol tutor 2',
       'Entrepà infant', 'Entrepà tutor 1', 'Entrepà tutor 2'],
      [ts, infant,
       labelCorrefocInfInfant_(p.correfoc_inf_infant),
       tutor1,
       labelCorrefocInfTutor_(p.correfoc_inf_tutor1),
       tutor2,
       labelCorrefocInfTutor_(p.correfoc_inf_tutor2),
       p.sopar_correfoc_infant === 'si' ? 'Sí' : 'No',
       p.sopar_correfoc_tutor1 === 'si' ? 'Sí' : (p.sopar_correfoc_tutor1 === 'ja_contestat' ? 'Ja contestat al bloc adult' : 'No'),
       p.sopar_correfoc_tutor2 === 'si' ? 'Sí' : (p.sopar_correfoc_tutor2 === 'no_tutor2' ? '—' : 'No')]);
  }

  // Cercavila infantil
  if (p.cercavila_inf_infant && p.cercavila_inf_infant !== 'no') {
    appendRow_('CERCAVILA_INF',
      ['Timestamp', 'Infant', 'Rol'],
      [ts, infant, labelCercavilaInf_(p.cercavila_inf_infant)]);
  }

  // Ensierru infantil
  if ((p.ensierru_inf_infant && p.ensierru_inf_infant !== 'no') ||
      (p.ensierru_inf_tutor1 && !['no', 'ja_contestat'].includes(p.ensierru_inf_tutor1)) ||
      (p.ensierru_inf_tutor2 && p.ensierru_inf_tutor2 !== 'no')) {
    appendRow_('ENSIERRU_INF',
      ['Timestamp', 'Infant', 'Rol infant',
       'Tutor 1', 'Rol tutor 1', 'Tutor 2', 'Rol tutor 2'],
      [ts, infant,
       labelEnsierruInfInfant_(p.ensierru_inf_infant),
       tutor1, labelEnsierruInfTutor_(p.ensierru_inf_tutor1),
       tutor2, labelEnsierruInfTutor_(p.ensierru_inf_tutor2)]);
  }
}

function processaSoparFamilia_(p, ts) {
  const n = parseInt(p.sopar_persones_familia || '0', 10);
  if (!n) return;
  appendRow_('SOPAR_IDIOTES',
    ['Timestamp', 'Nom de qui apunta', 'Tipus', 'Persones', 'Intoleràncies'],
    [ts, p.tutor1_name || p.adult_name || '', 'Família (perfil ' + p.profile + ')', n,
     [formatAlergies_(p.tutor1_alergies), formatAlergies_(p.tutor2_alergies), formatAlergies_(p.infant_alergies)]
       .filter((x) => x && x !== 'No').join(' | ')]);
}

function processaVestitsTutor_(p, ts) {
  if (!p.casaca_tutor && !p.peto_tutor) return;
  if (p.casaca_tutor === 'ja_contestat' && p.peto_tutor === 'ja_contestat') return;
  appendRow_('VESTITS',
    ['Timestamp', 'Nom', 'Tipus', 'Casaca pròpia', 'Peto propi', 'Talla casaca si demana'],
    [ts, p.tutor1_name || '', 'Tutor',
     p.casaca_tutor === 'si' ? 'Sí' : (p.casaca_tutor === 'no' ? 'No' : '—'),
     p.peto_tutor === 'si' ? 'Sí' : (p.peto_tutor === 'no' ? 'No' : '—'),
     '']);
}

function processaFedeTutor_(p, ts) {
  const sel = (p.fede_tutor || []).filter((v) => !['no', 'ja_contestat'].includes(v));
  if (sel.length === 0) return;
  appendRow_('FEDE',
    ['Timestamp', 'Nom', 'Tipus', 'Esmorzar', 'Cercavila Adult', 'Cercavila Infantil'],
    [ts, p.tutor1_name || '', 'Tutor',
     sel.includes('esmorzar') ? '✓' : '',
     sel.includes('cercavila_adult') ? '✓' : '',
     sel.includes('cercavila_inf') ? '✓' : '']);
}

// ════════════════════════════════════════════════════════════════
//   ETIQUETES (value → text)
// ════════════════════════════════════════════════════════════════

const L = {
  cercagallines: {
    capgros: 'Capgròs', acomp_capgros: 'Acompanyant capgròs', xaranga: 'Xaranga',
    balcons: 'Balcons', recollir: 'Recollir gallines', carro: 'Carro de fusta',
    nunci: 'Estructura Nunci', confeti: 'Confeti', barretines: 'Venda barretines',
    faci_falta: 'El que faci falta',
  },
  teatre: {
    anima: 'Ànima', furia: 'Fúria', logistica: 'Logística', circ: 'Circ',
    monjo: 'Monjo/a', music: 'Músic/a', faci_falta: 'El que faci falta',
  },
  correfoc: {
    cremador: 'Cremador/a', encenedor: 'Encenedor/a', repartidor: 'Repartidor/a',
    circ: 'Circ', carro_polvori: 'Carro polvorí', carro_aigua: 'Carro Aigua',
    music: 'Músic/a', seguretat: 'Seguretat', faci_falta: 'El que faci falta',
  },
  ensierru_matiner: {
    gallina: 'Gallina', gall: 'Gall', carregador: 'Carregador/a', repartidor: 'Repartidor/a',
    encenedor: 'Encenedor/a', polvori: 'Polvorí', faci_falta: 'El que faci falta',
  },
  cercavila_dium: {
    gallina: 'Gallina', gall: 'Gall', carregador: 'Carregador/a',
    encenedor: 'Encenedor/a', polvori: 'Polvorí', faci_falta: 'El que faci falta',
  },
  ensierru: {
    gallina: 'Gallina', gall: 'Gall', carregador: 'Carregador/a', repartidor: 'Repartidor/a',
    encenedor: 'Encenedor/a', polvori: 'Polvorí', comentarista: 'Comentarista',
    paradeta: 'Paradeta', seguretat: 'Seguretat', faci_falta: 'El que faci falta',
  },
  cercagallines_inf: { balcons: 'Balcons', faci_falta: 'El que faci falta' },
  cercavila_inf: { pollet: 'Pollet', ramoneta: 'Ramoneta', tabaler: 'Tabaler/a' },
  correfoc_inf_infant: { cremador: 'Cremador/a', tabaler: 'Tabaler/a' },
  correfoc_inf_tutor: {
    encenedor: 'Encenedor/a', carregador: 'Carregador/a', descarregador: 'Descarregador/a',
    monjo: 'Monjo/a', polvori: 'Polvorí', carro_aigua: 'Carro Aigua',
    linia_vida: 'Línia de vida', linia_seguretat: 'Línia de seguretat',
    gestio_convidada: 'Gestió colla convidada', ja_contestat: 'Ja contestat al bloc adult',
  },
  ensierru_inf_infant: { pollet: 'Pollet', gallina: 'Gallina' },
  ensierru_inf_tutor: {
    carregador: 'Carregador/a', pastor: 'Pastor/a', encenedor: 'Encenedor/a',
    polvori: 'Polvorí', repartidor: 'Repartidor/a', necessiteu: 'El que necessiteu',
    ja_contestat: 'Ja contestat al bloc adult',
  },
};

function labelCercagallines_(v) { return L.cercagallines[v] || v; }
function labelTeatre_(v) { return L.teatre[v] || v; }
function labelCorrefoc_(v) { return L.correfoc[v] || v; }
function labelEnsierruMatiner_(v) { return L.ensierru_matiner[v] || v; }
function labelCercavilaDium_(v) { return L.cercavila_dium[v] || v; }
function labelEnsierru_(v) { return L.ensierru[v] || v; }
function labelCercagallinesInf_(v) { return L.cercagallines_inf[v] || v; }
function labelCercavilaInf_(v) { return L.cercavila_inf[v] || v; }
function labelCorrefocInfInfant_(v) { return L.correfoc_inf_infant[v] || v; }
function labelCorrefocInfTutor_(v) { return v ? (L.correfoc_inf_tutor[v] || v) : ''; }
function labelEnsierruInfInfant_(v) { return L.ensierru_inf_infant[v] || v; }
function labelEnsierruInfTutor_(v) { return v ? (L.ensierru_inf_tutor[v] || v) : ''; }

function formatAlergies_(a) {
  if (!a) return '';
  if (typeof a === 'string') return a;
  const list = Array.isArray(a.list) ? a.list : [];
  const altres = a.altres || '';
  if (list.includes('No') && !altres) return 'No';
  const all = list.filter((x) => x !== 'No');
  if (altres) all.push(altres);
  return all.join(', ');
}

// ════════════════════════════════════════════════════════════════
//   RESUM AGREGAT
// ════════════════════════════════════════════════════════════════

function regeneraResum_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName('RESUM');
  if (sh) sh.clear();
  else sh = ss.insertSheet('RESUM', 0);

  const dades = [
    ['📊 RESUM LA LLAGASTADA 2026', ''],
    ['', ''],
    ['Adults registrats', count_('ADULTS')],
    ['Infants registrats', count_('INFANTS')],
    ['', ''],
    ['🎯 PARTICIPANTS PER ACTE', ''],
    ['Cercavila Alternativa', count_('CERCAVILA_ALT')],
    ['Cercagallines (adult)', count_('CERCAGALLINES')],
    ['Cercagallines (infant)', count_('CERCAGALLINES_INF')],
    ['Cercatapes (adult)', count_('CERCATAPES')],
    ['Cercatapes (infant)', count_('CERCATAPES_INF')],
    ['Teatre', count_('TEATRE')],
    ['Correfoc', count_('CORREFOC')],
    ['Correfoc infantil', count_('CORREFOC_INF')],
    ['Ensierru matiner', count_('ENSIERRU_MATINER')],
    ['Cercavila diumenge', count_('CERCAVILA_DIUM')],
    ['Cercavila infantil', count_('CERCAVILA_INF')],
    ['Ensierru', count_('ENSIERRU')],
    ['Ensierru infantil', count_('ENSIERRU_INF')],
    ['', ''],
    ['🍔 SOPAR DELS IDIOTES', ''],
    ['Total persones', sumColumn_('SOPAR_IDIOTES', 4)],
    ['', ''],
    ['👘 VESTITS', ''],
    ['Total demandes vestit', count_('VESTITS')],
    ['', ''],
    ['🎐 LA FEDE', ''],
    ['Total ofertes col·laboració', count_('FEDE')],
  ];

  sh.getRange(1, 1, dades.length, 2).setValues(dades);
  sh.getRange(1, 1).setFontWeight('bold').setFontSize(14).setBackground('#FF5C00').setFontColor('#FFFFFF');
  sh.getRange(1, 1, 1, 2).merge();
  sh.setColumnWidth(1, 350);
  sh.setColumnWidth(2, 100);

  // Negretes a capçaleres
  for (let i = 0; i < dades.length; i++) {
    if (dades[i][1] === '' && dades[i][0] !== '' && i > 0) {
      sh.getRange(i + 1, 1).setFontWeight('bold').setBackground('#FFE5D2');
    }
  }
}

function count_(name) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh) return 0;
  return Math.max(0, sh.getLastRow() - 1);
}

function sumColumn_(name, col) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return 0;
  const values = sh.getRange(2, col, sh.getLastRow() - 1, 1).getValues();
  return values.reduce((s, [v]) => s + (parseInt(v, 10) || 0), 0);
}
