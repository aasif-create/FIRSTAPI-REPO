/**
 * app.js — Product Search frontend logic (final)
 * - Expects backend at apiBase (change if needed)
 * - Provides: build query, call API, render cards, show request/response JSON
 * - Timeline animation uses sanitized _trace if available
 */

/* ====== CONFIG ====== */
const apiBase = 'http://localhost:8080'; // change if your backend runs elsewhere

/* ====== DOM REFERENCES ====== */
const qEl = document.getElementById('q');
const catEl = document.getElementById('category');
const cuisineEl = document.getElementById('cuisine');
const minPriceEl = document.getElementById('minPrice');
const maxPriceEl = document.getElementById('maxPrice');
const vegEl = document.getElementById('veg');
const searchForm = document.getElementById('searchForm');
const resultsEl = document.getElementById('results');

const reqUrlEl = document.getElementById('reqUrl');
const responseJsonEl = document.getElementById('responseJson');
const statusEl = document.getElementById('status');
const timeEl = document.getElementById('timeMs');

const timelineNodes = document.querySelectorAll('.timeline .node');
const copyCurlBtn = document.getElementById('copyCurl');
const openH2Btn = document.getElementById('openH2');

/* ====== UTILITIES ====== */
function setActiveNode(id) {
  timelineNodes.forEach(n => {
    if (n.dataset.id === id) n.classList.add('active');
    else n.classList.remove('active');
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(s) {
  return (s + '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/* ====== BUILD QUERY URL ====== */
function buildUrl() {
  const q = qEl?.value?.trim() || '';
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (catEl?.value) params.set('category', catEl.value);
  if (cuisineEl?.value) params.set('cuisine', cuisineEl.value);
  if (minPriceEl?.value) params.set('minPrice', minPriceEl.value);
  if (maxPriceEl?.value) params.set('maxPrice', maxPriceEl.value);
  if (vegEl?.checked) params.set('veg', 'true');
  params.set('page', '0');
  params.set('size', '12');
  params.set('demo', 'true'); // request demo trace from backend (safe mode)
  return `${apiBase}/api/products/search?${params.toString()}`;
}

/* ====== RENDER CARD ====== */
function renderCard(p) {
  const img = p.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60&auto=format&fit=crop';
  const name = escapeHtml(p.name || 'Untitled');
  const price = escapeHtml(String(p.price ?? '-'));
  const desc = escapeHtml(p.description || '');
  return `
    <div class="result-card card">
      <img src="${img}" alt="${name}" loading="lazy">
      <h4>${name}</h4>
      <div class="price">₹ ${price}</div>
      <div class="small">${desc}</div>
    </div>`;
}

/* ====== TIMELINE ANIMATION (uses _trace if present) ====== */
async function animateTrace(trace) {
  // Safe default animation timings (ms)
  try {
    setActiveNode('client');
    await sleep(80);
    setActiveNode('api');
    await sleep(120);

    if (trace && typeof trace === 'object') {
      const scale = 1.0; // tweak to speed/slow animation
      const apiMs = Math.max(10, trace.apiProcessingMs || 60);
      const serverDbMs = Math.max(8, trace.serverToDbMs || 20);
      const dbMs = Math.max(6, trace.dbProcessingMs || 15);

      await sleep(Math.round(apiMs * scale));
      setActiveNode('server');
      await sleep(Math.round(serverDbMs * scale));
      setActiveNode('db');
      await sleep(Math.round(dbMs * scale));
    } else {
      // fallback short animation
      setActiveNode('server');
      await sleep(140);
      setActiveNode('db');
      await sleep(80);
    }

    setActiveNode('done');
    await sleep(200);
  } catch (e) {
    console.warn('animateTrace error', e);
  } finally {
    // clear highlight
    timelineNodes.forEach(n => n.classList.remove('active'));
  }
}

/* ====== PERFORM SEARCH ====== */
async function performSearch(e) {
  if (e) e.preventDefault();

  // UI reset
  resultsEl.innerHTML = '';
  responseJsonEl.textContent = 'Loading...';
  reqUrlEl.textContent = '-';
  statusEl.textContent = '-';
  timeEl.textContent = '-';

  // Build URL
  const url = buildUrl();
  reqUrlEl.textContent = url;

  // Copy cURL behavior
  copyCurlBtn.onclick = () => {
    const curl = `curl -X GET '${url}'`;
    navigator.clipboard?.writeText(curl).then(() => {
      copyCurlBtn.textContent = 'Copied!';
      setTimeout(() => copyCurlBtn.textContent = 'Copy cURL', 1200);
    }).catch(() => alert('Clipboard failed'));
  };

  // Open H2 console
  openH2Btn.onclick = () => {
    window.open(apiBase + '/h2-console', '_blank');
  };

  // Start timeline
  setActiveNode('client');
  const t0 = performance.now();

  try {
    setActiveNode('api');
    const res = await fetch(url, { method: 'GET' });
    const duration = Math.round(performance.now() - t0);

    // parse JSON safely
    const json = await res.json().catch(() => null);

    statusEl.textContent = res.status;
    timeEl.textContent = duration;
    responseJsonEl.textContent = json ? JSON.stringify(json, null, 2) : 'No JSON body';

    const data = json?.data ?? json ?? [];
    if (Array.isArray(data)) {
      if (data.length === 0) {
        resultsEl.innerHTML = `<div class="card" style="padding:18px;">No results found</div>`;
      } else {
        resultsEl.innerHTML = data.map(item => renderCard(item)).join('\n');
      }
    } else {
      resultsEl.innerHTML = `<div class="card" style="padding:18px;">Unexpected response format</div>`;
    }

    // animate timeline with trace if provided
    await animateTrace(json?._trace);

  } catch (err) {
    // network or CORS error
    responseJsonEl.textContent = JSON.stringify({ error: err?.message || String(err) }, null, 2);
    resultsEl.innerHTML = `<div class="card" style="padding:18px;">Network error or CORS. Check backend & console.</div>`;
    console.error(err);
  }
}

/* ====== INITIALIZE ====== */
(function init() {
  if (!searchForm || !resultsEl) {
    console.warn('Essential DOM elements missing. Check home.html ids.');
    return;
  }

  searchForm.addEventListener('submit', performSearch);

  // Hook copy & open buttons if they exist
  if (copyCurlBtn) copyCurlBtn.disabled = false;
  if (openH2Btn) openH2Btn.disabled = false;

  // Small UX: prefill a demo query
  if (qEl && !qEl.value) qEl.value = 'burger';
  // Uncomment the next line if you want auto-search on page load:
  // performSearch();
})();
