const qs = (s) => document.querySelector(s);
const resultEl = qs('#result');

function buildPayload() {
  const brandName = qs('#brandName').value.trim();
  const brandUrl = qs('#brandUrl').value.trim();
  const compLines = qs('#competitors').value.split('\n').map(l => l.trim()).filter(Boolean);

  const competitors = compLines.map(line => {
    // Accept "Name | URL" or just "Name"
    const [name, url] = line.split('|').map(p => (p || '').trim());
    return { name: name || null, url: url || null };
  });

  return {
    brand: { name: brandName || null, url: brandUrl || null, meta: null },
    competitors
  };
}

function getApiBase() {
  const v = qs('#apiBase').value.trim();
  // If empty, use same origin (relative path)
  return v || '';
}

async function callApi(path, payload, expectBlob = false) {
  const base = getApiBase();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errPayload;
    try { errPayload = await res.json(); } catch { errPayload = await res.text(); }
    throw new Error(`API ${res.status} ${res.statusText}: ${JSON.stringify(errPayload)}`);
  }

  if (expectBlob) return await res.blob();
  return await res.json();
}

function show(json) {
  resultEl.textContent = JSON.stringify(json, null, 2);
}

function showError(err) {
  resultEl.textContent = `❌ ${err.message}`;
}

qs('#analyzeBtn').addEventListener('click', async () => {
  const payload = buildPayload();
  show({status: "sending", payload});
  try {
    const data = await callApi('/api/intelligence/analyze', payload);
    show(data);
  } catch (err) {
    showError(err);
  }
});

qs('#exportBtn').addEventListener('click', async () => {
  const payload = buildPayload();
  show({status: "exporting", payload});
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
    show({ok: true, message: 'CSV downloaded.'});
  } catch (err) {
    showError(err);
  }
});
