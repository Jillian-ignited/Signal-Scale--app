const qs = (s) => document.querySelector(s);
const resultEl = qs('#result');

function buildPayload() {
  const brandName = qs('#brandName').value.trim();
  const brandUrl = qs('#brandUrl').value.trim();
  const compLines = qs('#competitors').value.split('\n').map(l => l.trim()).filter(Boolean);
  const competitors = compLines.map(line => {
    const [name, url] = line.split('|').map(p => (p || '').trim());
    return { name: name || null, url: url || null };
  });
  return { brand: { name: brandName || null, url: brandUrl || null, meta: null }, competitors };
}

function getApiBase() {
  const v = qs('#apiBase').value.trim();
  return v || '';
}

/** Robust fetch: reads text, then tries JSON. Prevents "Unexpected end of JSON input". */
async function callApi(path, payload, expectBlob = false) {
  const base = getApiBase();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (expectBlob) {
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`API ${res.status} ${res.statusText}: ${text || '[no body]'}`);
    }
    return await res.blob();
  }

  const raw = await res.text().catch(() => '');
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* not JSON */ }

  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText}: ${data ? JSON.stringify(data) : (raw || '[no body]')}`);
  }
  return data ?? { ok: true, notice: 'Empty JSON body returned.' };
}

function show(x) { resultEl.textContent = JSON.stringify(x, null, 2); }
function showError(err) { resultEl.textContent = `❌ ${err.message}`; }

qs('#analyzeBtn').addEventListener('click', async () => {
  const payload = buildPayload();
  show({ status: 'sending', payload });
  try {
    const data = await callApi('/api/intelligence/analyze', payload);
    show(data);
  } catch (err) { showError(err); }
});

qs('#exportBtn').addEventListener('click', async () => {
  const payload = buildPayload();
  show({ status: 'exporting', payload });
  try {
    const blob = await callApi('/api/intelligence/export', payload, true);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signal_scale_export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    show({ ok: true, message: 'CSV downloaded.' });
  } catch (err) { showError(err); }
});
