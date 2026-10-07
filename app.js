/* ============================================
   BOTSWANA ECONOMIC PULSE — Dashboard Logic
   Loads real data from data/dashboard.json
   Falls back to sample data if unavailable.
============================================ */

/* ============================================
   CHART DEFAULTS
============================================ */
Chart.defaults.color = '#94A3B8';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.backgroundColor = '#132039';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(148,163,184,0.2)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.titleColor = '#E5E7EB';
Chart.defaults.plugins.tooltip.bodyColor = '#94A3B8';
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 10;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.maintainAspectRatio = false;

/* ============================================
   SAMPLE / FALLBACK DATA
============================================ */
const SAMPLE = {
    kpis: { usd: 13.42, zar: 0.73, eur: 14.82, gbp: 17.15, inflation: 3.8, gdp: 2.7 },
    fuel_prices: {
        months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        petrol: [15.42, 15.42, 15.68, 15.68, 15.68, 15.92, 16.14, 16.14, 16.40, 16.40, 16.40, 16.40],
        diesel: [14.85, 14.85, 15.10, 15.10, 15.10, 15.35, 15.55, 15.55, 15.78, 15.78, 15.78, 15.78]
    },
    insights: [
        { type: 'info', icon: 'fa-circle-info', title: 'Live data loading', text: 'Once the pipeline runs, real Botswana data will appear here.' }
    ]
};

/* ============================================
   HELPERS
============================================ */
function randomWalk(start, points = 20, volatility = 0.02) {
    const arr = [start];
    for (let i = 1; i < points; i++) {
        const change = (Math.random() - 0.5) * volatility * arr[i - 1];
        arr.push(+(arr[i - 1] + change).toFixed(4));
    }
    return arr;
}

function setText(id, value, decimals = 2) {
    const el = document.getElementById(id);
    if (!el || value === null || value === undefined) return;
    el.innerText = typeof value === 'number' ? value.toFixed(decimals) : value;
}

/* ============================================
   SPARKLINES
============================================ */
function buildSparkline(id, data, color) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    if (canvas._chart) canvas._chart.destroy();
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 40);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '00');
    canvas._chart = new Chart(ctx, {
        type: 'line',
        data: { labels: data.map((_, i) => i), datasets: [{ data, borderColor: color, backgroundColor: gradient, borderWidth: 1.5, fill: true, tension: 0.4, pointRadius: 0 }] },
        options: { plugins: { tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, animation: { duration: 1200 } }
    });
}

/* ============================================
   MAIN CHARTS
============================================ */
function buildCurrencyChart() {
    const days = Array.from({ length: 90 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (89 - i));
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    });
    new Chart(document.getElementById('chart-currency'), {
        type: 'line',
        data: { labels: days, datasets: [
            { label: 'USD', data: randomWalk(13.42, 90, 0.008), borderColor: '#10B981', borderWidth: 2, tension: 0.4, pointRadius: 0 },
            { label: 'ZAR', data: randomWalk(0.73, 90, 0.01), borderColor: '#F59E0B', borderWidth: 2, tension: 0.4, pointRadius: 0 },
            { label: 'EUR', data: randomWalk(14.82, 90, 0.009), borderColor: '#3B82F6', borderWidth: 2, tension: 0.4, pointRadius: 0 }
        ]},
        options: {
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { grid: { color: 'rgba(148,163,184,0.06)' }, ticks: { maxTicksLimit: 6, color: '#64748B', font: { family: "'JetBrains Mono', monospace", size: 10 } } },
                y: { grid: { color: 'rgba(148,163,184,0.06)' }, ticks: { color: '#64748B', font: { family: "'JetBrains Mono', monospace", size: 10 } } }
            }
        }
    });
}

function buildFuelChart(fuel) {
    const data = fuel || SAMPLE.fuel_prices;
    new Chart(document.getElementById('chart-fuel'), {
        type: 'bar',
        data: { labels: data.months, datasets: [
            { label: 'Petrol 95', data: data.petrol, backgroundColor: '#10B981', borderRadius: 4, barPercentage: 0.6 },
            { label: 'Diesel 50', data: data.diesel, backgroundColor: '#F59E0B', borderRadius: 4, barPercentage: 0.6 }
        ]},
        options: {
            plugins: { tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: P${ctx.parsed.y.toFixed(2)}/L` } } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#64748B', font: { family: "'JetBrains Mono', monospace", size: 10 } } },
                y: { grid: { color: 'rgba(148,163,184,0.06)' }, ticks: { color: '#64748B', font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (v) => 'P' + v } }
            }
        }
    });
}

function buildBseChart() {
    new Chart(document.getElementById('chart-bse'), {
        type: 'doughnut',
        data: { labels: ['Financials','Mining','Retail','Property','Services'], datasets: [{ data: [32,24,18,14,12], backgroundColor: ['#10B981','#F59E0B','#3B82F6','#8B5CF6','#F43F5E'], borderWidth: 0, hoverOffset: 8 }] },
        options: { cutout: '65%', plugins: { legend: { display: true, position: 'bottom', labels: { color: '#94A3B8', font: { size: 11, weight: '500' }, padding: 14, usePointStyle: true, boxWidth: 8 } } } }
    });
}

function buildCompareChart() {
    new Chart(document.getElementById('chart-compare'), {
        type: 'bar',
        data: { labels: ['Botswana','South Africa','Namibia','Zambia','Zimbabwe','Angola'], datasets: [{ data: [2.7,1.2,3.1,3.8,5.6,2.4], backgroundColor: ['#10B981','#3B82F6','#F59E0B','#8B5CF6','#F43F5E','#94A3B8'], borderRadius: 8, barPercentage: 0.65 }] },
        options: { indexAxis: 'y', plugins: { tooltip: { callbacks: { label: (ctx) => ` GDP Growth: ${ctx.parsed.x}%` } } }, scales: { x: { grid: { color: 'rgba(148,163,184,0.06)' }, ticks: { color: '#64748B', callback: (v) => v + '%' } }, y: { grid: { display: false }, ticks: { color: '#94A3B8', font: { size: 11, weight: '500' } } } } }
}

/* ============================================
   INSIGHTS
============================================ */
function renderInsights(insights) {
    const grid = document.getElementById('insights-grid');
    if (!grid) return;
    const list = insights && insights.length ? insights : SAMPLE.insights;
    grid.innerHTML = list.map(i => `
        <div class="insight-card">
            <div class="insight-icon ${i.type}"><i class="fas ${i.icon}"></i></div>
            <div class="insight-content">
                <div class="insight-title">${i.title}</div>
                <div class="insight-text">${i.text}</div>
            </div>
        </div>
    `).join('');
}

/* ============================================
   CLOCK
============================================ */
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Gaborone' });
    const el = document.getElementById('nav-time');
    if (el) el.innerText = time + ' CAT';
}

/* ============================================
   ACTIONS
============================================ */
function refreshData() {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-rotate fa-spin"></i> Refreshing...';
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; loadDashboard(); }, 800);
}

function downloadReport() {
    alert('📄 Report generation coming in Phase 4.');
}

/* ============================================
   LOAD DASHBOARD DATA
============================================ */
async function loadDashboard() {
    let payload = null;
    try {
        const response = await fetch('data/dashboard.json?t=' + Date.now());
        if (response.ok) {
            payload = await response.json();
            console.log('✅ Loaded live dashboard data:', payload);
        }
    } catch (err) {
        console.info('ℹ️ No live data yet — using sample data.');
    }

    const kpis = (payload && payload.kpis) || SAMPLE.kpis;

    setText('kpi-usd', kpis.usd, 4);
    setText('kpi-zar', kpis.zar, 4);
    setText('kpi-inflation', kpis.inflation, 1);
    const inflationEl = document.getElementById('kpi-inflation');
    if (inflationEl && kpis.inflation != null) inflationEl.innerText = kpis.inflation.toFixed(1) + '%';
    const gdpEl = document.getElementById('kpi-gdp');
    if (gdpEl && kpis.gdp != null) gdpEl.innerText = kpis.gdp.toFixed(1) + '%';

    // Update "last update" timestamp
    const lastUpdateEl = document.getElementById('last-update');
    if (lastUpdateEl && payload && payload.generated_at_local) {
        lastUpdateEl.innerText = payload.generated_at_local;
    }

    // Build charts
    buildSparkline('spark-usd', randomWalk(kpis.usd || 13.42, 20, 0.015), '#10B981');
    buildSparkline('spark-zar', randomWalk(kpis.zar || 0.73, 20, 0.015), '#F59E0B');
    buildSparkline('spark-inflation', randomWalk(kpis.inflation || 3.8, 20, 0.04), '#F43F5E');
    buildSparkline('spark-gdp', randomWalk(kpis.gdp || 2.7, 20, 0.03), '#3B82F6');

    buildCurrencyChart();
    buildFuelChart(payload && payload.fuel_prices);
    buildBseChart();
    buildCompareChart();
    renderInsights(payload && payload.insights);
}

/* ============================================
   INIT
============================================ */
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    updateClock();
    setInterval(updateClock, 30000);
});
