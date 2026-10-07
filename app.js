/* ============================================
   BOTSWANA ECONOMIC PULSE — Dashboard Logic
   Phase 1: Sample data (Phase 2 swaps in real API)
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
Chart.defaults.plugins.tooltip.titleFont = { family: "'JetBrains Mono', monospace", weight: '700', size: 12 };
Chart.defaults.plugins.tooltip.bodyFont = { family: "'Inter', sans-serif", size: 11 };
Chart.defaults.maintainAspectRatio = false;

/* ============================================
   HELPER — Generate sparkline data
============================================ */
function randomWalk(start, points = 20, volatility = 0.02) {
    const arr = [start];
    for (let i = 1; i < points; i++) {
        const change = (Math.random() - 0.5) * volatility * arr[i - 1];
        arr.push(+(arr[i - 1] + change).toFixed(4));
    }
    return arr;
}

/* ============================================
   SPARKLINES
============================================ */
function buildSparkline(id, data, color) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 40);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '00');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data,
                borderColor: color,
                backgroundColor: gradient,
                borderWidth: 1.5,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        },
        options: {
            plugins: { tooltip: { enabled: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            animation: { duration: 1200, easing: 'easeOutQuart' }
        }
    });
}

/* ============================================
   MAIN CURRENCY CHART
============================================ */
function buildCurrencyChart() {
    const days = Array.from({ length: 90 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (89 - i));
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    });

    const usd = randomWalk(13.6, 90, 0.008);
    const zar = randomWalk(0.72, 90, 0.01);
    const eur = randomWalk(14.8, 90, 0.009);

    new Chart(document.getElementById('chart-currency'), {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                { label: 'USD', data: usd, borderColor: '#10B981', borderWidth: 2, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: '#10B981', pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2 },
                { label: 'ZAR', data: zar, borderColor: '#F59E0B', borderWidth: 2, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: '#F59E0B', pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2 },
                { label: 'EUR', data: eur, borderColor: '#3B82F6', borderWidth: 2, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: '#3B82F6', pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2 }
            ]
        },
        options: {
            interaction: { mode: 'index', intersect: false },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (items) => items[0].label,
                        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(3)}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false },
                    ticks: { maxTicksLimit: 6, color: '#64748B', font: { family: "'JetBrains Mono', monospace", size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false },
                    ticks: { color: '#64748B', font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (v) => v.toFixed(1) }
                }
            }
        }
    });
}

/* ============================================
   FUEL PRICES CHART
============================================ */
function buildFuelChart() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    new Chart(document.getElementById('chart-fuel'), {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                { label: 'Petrol 95', data: [15.42, 15.42, 15.68, 15.68, 15.68, 15.92, 16.14, 16.14, 16.40, 16.40, 16.40, 16.40], backgroundColor: '#10B981', borderRadius: 4, barPercentage: 0.6 },
                { label: 'Diesel 50', data: [14.85, 14.85, 15.10, 15.10, 15.10, 15.35, 15.55, 15.55, 15.78, 15.78, 15.78, 15.78], backgroundColor: '#F59E0B', borderRadius: 4, barPercentage: 0.6 }
            ]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.dataset.label}: P${ctx.parsed.y.toFixed(2)}/L`
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#64748B', font: { family: "'JetBrains Mono', monospace", size: 10 } } },
                y: { grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false }, ticks: { color: '#64748B', font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (v) => 'P' + v } }
            }
        }
    });
}

/* ============================================
   BSE SECTOR CHART (Doughnut)
============================================ */
function buildBseChart() {
    new Chart(document.getElementById('chart-bse'), {
        type: 'doughnut',
        data: {
            labels: ['Financials', 'Mining', 'Retail', 'Property', 'Services'],
            datasets: [{
                data: [32, 24, 18, 14, 12],
                backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#F43F5E'],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            cutout: '65%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#94A3B8',
                        font: { family: "'Inter', sans-serif", size: 11, weight: '500' },
                        padding: 14,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        boxHeight: 8
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
                    }
                }
            }
        }
    });
}

/* ============================================
   COUNTRY COMPARISON CHART
============================================ */
function buildCompareChart() {
    new Chart(document.getElementById('chart-compare'), {
        type: 'bar',
        data: {
            labels: ['Botswana', 'South Africa', 'Namibia', 'Zambia', 'Zimbabwe', 'Angola'],
            datasets: [{
                data: [2.7, 1.2, 3.1, 3.8, 5.6, 2.4],
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#F43F5E', '#94A3B8'],
                borderRadius: 8,
                barPercentage: 0.65
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` GDP Growth: ${ctx.parsed.x}%`
                    }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false }, ticks: { color: '#64748B', font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (v) => v + '%' } },
                y: { grid: { display: false }, ticks: { color: '#94A3B8', font: { family: "'Inter', sans-serif", size: 11, weight: '500' } } }
            }
        }
    });
}

/* ============================================
   INSIGHTS FEED
============================================ */
const insights = [
    { type: 'warning', icon: 'fa-arrow-trend-down', title: 'Pula weakens against USD', text: 'The Pula fell 0.34% today — the largest single-day drop in the last 3 weeks. Watch for further weakening if the Rand continues its slide.' },
    { type: 'positive', icon: 'fa-chart-line', title: 'Inflation eases to 3.8%', text: 'Inflation dropped 0.2 percentage points from last month, staying comfortably within Bank of Botswana\'s 3–6% target range.' },
    { type: 'info', icon: 'fa-gas-pump', title: 'Fuel prices stable this month', text: 'Petrol and diesel prices remain unchanged at P16.40 and P15.78 respectively. Next adjustment expected 1st of next month.' },
    { type: 'positive', icon: 'fa-building-columns', title: 'BSE up 1.2% this week', text: 'The Botswana Stock Exchange rose on strong banking sector performance. FNBB and Letshego led the gains.' },
    { type: 'danger', icon: 'fa-triangle-exclamation', title: 'Diamond exports decline', text: 'Diamond export revenue fell 8.3% quarter-on-quarter — a key concern for government revenue and the Pula\'s long-term stability.' },
    { type: 'info', icon: 'fa-globe-africa', title: 'Zimbabwe leads regional growth', text: 'At 5.6%, Zimbabwe shows the highest GDP growth in the region. Botswana remains solidly above South Africa\'s 1.2%.' }
];

function renderInsights() {
    const grid = document.getElementById('insights-grid');
    if (!grid) return;
    grid.innerHTML = insights.map(i => `
        <div class="insight-card">
            <div class="insight-icon ${i.type}">
                <i class="fas ${i.icon}"></i>
            </div>
            <div class="insight-content">
                <div class="insight-title">${i.title}</div>
                <div class="insight-text">${i.text}</div>
            </div>
        </div>
    `).join('');
}

/* ============================================
   NAV CLOCK
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

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        // Regenerate sparklines
        buildSparkline('spark-usd', randomWalk(13.42, 20, 0.015), '#10B981');
        buildSparkline('spark-zar', randomWalk(0.73, 20, 0.015), '#F59E0B');
        buildSparkline('spark-inflation', randomWalk(3.8, 20, 0.04), '#F43F5E');
        buildSparkline('spark-gdp', randomWalk(2.7, 20, 0.03), '#3B82F6');
    }, 800);
}

function downloadReport() {
    alert('📄 Report generation coming in Phase 4.\n\nFor now, this will produce a PDF summary of the current dashboard.');
}

/* ============================================
   INIT
============================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Sparklines
    buildSparkline('spark-usd', randomWalk(13.42, 20, 0.015), '#10B981');
    buildSparkline('spark-zar', randomWalk(0.73, 20, 0.015), '#F59E0B');
    buildSparkline('spark-inflation', randomWalk(3.8, 20, 0.04), '#F43F5E');
    buildSparkline('spark-gdp', randomWalk(2.7, 20, 0.03), '#3B82F6');

    // Main charts
    buildCurrencyChart();
    buildFuelChart();
    buildBseChart();
    buildCompareChart();

    // Insights
    renderInsights();

    // Clock
    updateClock();
    setInterval(updateClock, 30000);
});
