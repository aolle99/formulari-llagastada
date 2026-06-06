import Header from '@/components/Header';
import Wizard from '@/components/Wizard';

export default function Home() {
  return (
    <main className="min-h-screen bg-ash-50">
      <Header />
      <Intro />
      <Wizard />
      <Footer />
    </main>
  );
}

function Intro() {
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
      <div className="card p-6 sm:p-8 bg-gradient-to-br from-white to-brand-50/40">
        <div className="flex items-center gap-2 mb-3">
          <span className="chip">🔥 30è aniversari</span>
          <span className="chip bg-ash-100 text-ash-700">9–13 de juliol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ash-900 mb-3 leading-tight">
          La Llagastada — Festa Major d'Estiu
        </h1>
        <div className="space-y-3 text-ash-700 leading-relaxed">
          <p>
            La Llagastada gira entorn la llegenda de <strong>Sant Llagasta</strong>: el poble d'Esparreguera va robar
            les gallines d'aquest personatge perquè pensava que ponien ous d'or. Llagasta, en assabentar-se'n,
            va cremar la vila i els esparreguerins, espantats, li van retornar les gallines que, més que donar or,
            <em> treien foc pel bec</em>.
          </p>
          <p>
            En aquest formulari trobaràs <strong>tots els actes</strong> que organitzem des de la Colla de Diables
            (infantil i adulta). És molt important apuntar-se per assegurar l'equipament i poder preveure quants serem.
          </p>
          <p className="text-sm text-ash-600">
            ▸ Cal omplir-lo <strong>individualment</strong> per cada membre — inclòs cada infant per separat.<br />
            ▸ Si un càrrec està saturat, es repartirà per sorteig.<br />
            ▸ Si t'apuntes, vine — no et desapuntis a l'últim moment.
          </p>
          <div className="mt-4 p-3 rounded-lg bg-brand-50 border border-brand-200">
            <div className="font-semibold text-brand-800 text-sm">🕙 Data màxima d'inscripció</div>
            <div className="text-brand-900 font-bold">Diumenge 21 de juny a les 23:59 h</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="max-w-2xl mx-auto px-4 sm:px-6 py-10 text-center text-sm text-ash-500">
      <p className="italic">Adorem al nostre senyor Llagasta i cremem Esparreguera.</p>
      <p className="mt-1 font-semibold text-ash-700">Salut i foc 🔥</p>
      <p className="mt-4 text-xs text-ash-400">
        Colla de Diables d'Esparreguera · 30 anys
      </p>
    </footer>
  );
}
