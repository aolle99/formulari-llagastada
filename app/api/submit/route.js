export async function POST(request) {
  try {
    const body = await request.json();

    const url = process.env.APPS_SCRIPT_URL;
    if (!url) {
      return Response.json(
        { ok: false, error: 'APPS_SCRIPT_URL no està configurada. Mira el README.' },
        { status: 500 }
      );
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { ok: false, error: text }; }

    if (!res.ok || !data.ok) {
      return Response.json(
        { ok: false, error: data.error || 'Error en escriure al full' },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
