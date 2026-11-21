/**
 * PhysioElite — Premium Physiotherapy & Rehabilitation
 * charts.js — Chart.js visualization components
 *
 * Requires: Chart.js (loaded from CDN in page)
 * Colors: Sage Green #8FAE9B | Soft Teal #6B9C9A | Warm Beige #E8DFD2 | Charcoal #303A38
 */

'use strict';

const PhysioCharts = (() => {
  // Brand palette
  const C = {
    sage:       '#8FAE9B',
    sageMid:    'rgba(143,174,155,0.6)',
    sageFaint:  'rgba(143,174,155,0.15)',
    teal:       '#6B9C9A',
    tealMid:    'rgba(107,156,154,0.6)',
    tealFaint:  'rgba(107,156,154,0.15)',
    beige:      '#E8DFD2',
    charcoal:   '#303A38',
    white:      '#FFFFFF',
    grey:       '#94A3A0',
    red:        '#E07070',
    orange:     '#E0A870',
    green:      '#70C0A0',
  };

  // Shared default options factory
  function baseOptions(overrides = {}) {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            font: { family: "'DM Sans', sans-serif", size: 12 },
            color: C.charcoal,
            padding: 20,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: C.charcoal,
          titleColor: C.white,
          bodyColor: 'rgba(255,255,255,0.8)',
          titleFont: { family: "'Playfair Display', serif", size: 13 },
          bodyFont:  { family: "'DM Sans', sans-serif", size: 12 },
          padding: 12,
          cornerRadius: 10,
          borderColor: C.sage,
          borderWidth: 1,
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
          ticks: { font: { family: "'DM Sans', sans-serif", size: 11 }, color: C.grey }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
          ticks: { font: { family: "'DM Sans', sans-serif", size: 11 }, color: C.grey }
        }
      },
      ...overrides,
    };
  }

  /* ----------------------------------------------------------
     1. RECOVERY PROGRESS — Line Chart
        Pain level (0–10) decreasing over 12 weeks
     ---------------------------------------------------------- */
  function initRecoveryChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;
    if (canvas._chartInstance) canvas._chartInstance.destroy();
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const tealLine = dark ? '#a5d2cf' : '#3f6e6c';
    const sageLine = dark ? '#9cc4aa' : '#4f705b';
    const pointBorder = dark ? '#263330' : '#ffffff';

    const labels = ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8','Wk 9','Wk 10','Wk 11','Wk 12'];
    const painData = [8.2, 7.5, 6.8, 6.1, 5.4, 4.8, 4.2, 3.7, 3.4, 3.1, 2.8, 2.5];
    const targetData = [8, 7, 6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5];

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Your Pain Level',
            data: painData,
            borderColor: tealLine,
            backgroundColor: dark ? 'rgba(165,210,207,0.12)' : 'rgba(63,110,108,0.10)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: tealLine,
            pointBorderColor: pointBorder,
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: 'Target Recovery',
            data: targetData,
            borderColor: sageLine,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 3],
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          }
        ]
      },
      options: baseOptions({
        maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey } },
          y: {
            min: 0, max: 10,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { stepSize: 2, font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey,
              callback: v => v + '/10' }
          }
        },
        plugins: {
          ...baseOptions().plugins,
          annotation: undefined,
        }
      }),
    });

    canvas._chartInstance = chart;
    return chart;
  }

  /* ----------------------------------------------------------
     2. SESSION ATTENDANCE — Bar Chart
        Sessions attended per month (6 months)
     ---------------------------------------------------------- */
  function initSessionChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;
    if (canvas._chartInstance) canvas._chartInstance.destroy();
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sageBar = dark ? 'rgba(156,196,170,0.85)' : '#4f705b';
    const tealBar = dark ? 'rgba(165,210,207,0.75)' : '#3f6e6c';
    const sageBorder = dark ? '#9cc4aa' : '#4f705b';
    const tealBorder = dark ? '#a5d2cf' : '#3f6e6c';

    const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    const attended  = [2, 4, 6, 5, 7, 4];
    const scheduled = [2, 4, 6, 6, 8, 6];

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Sessions Attended',
            data: attended,
            backgroundColor: sageBar,
            borderColor: sageBorder,
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Sessions Scheduled',
            data: scheduled,
            backgroundColor: tealBar,
            borderColor: tealBorder,
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      },
      options: baseOptions({
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey } },
          y: { min: 0, max: 10, ticks: { stepSize: 2, font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey } }
        }
      }),
    });

    canvas._chartInstance = chart;
    return chart;
  }

  /* ----------------------------------------------------------
     3. PAIN LEVEL TRACKER — Line Chart (daily, last 30 days)
     ---------------------------------------------------------- */
  function initPainTracker(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;
    if (canvas._chartInstance) canvas._chartInstance.destroy();

    // Generate last 30 day labels
    const labels = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.getDate() + '/' + (d.getMonth() + 1));
    }

    // Simulated pain data trending downward with variance
    const rawData = [7,7,8,6,7,6,6,5,6,5,5,4,5,4,4,4,3,4,3,3,4,3,3,3,2,3,2,3,3,2];

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Daily Pain Level',
          data: rawData,
          borderColor: C.teal,
          backgroundColor: C.tealFaint,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 5,
          pointBackgroundColor: C.teal,
        }]
      },
      options: baseOptions({
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 8, font: { family: "'DM Sans',sans-serif", size: 10 }, color: C.grey }
          },
          y: {
            min: 0, max: 10,
            ticks: { stepSize: 2, font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey,
              callback: v => v + '/10' }
          }
        }
      }),
    });

    canvas._chartInstance = chart;
    return chart;
  }

  /* ----------------------------------------------------------
     4. APPOINTMENT STATISTICS — Doughnut Chart
     ---------------------------------------------------------- */
  function initAppointmentDonut(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;
    if (canvas._chartInstance) canvas._chartInstance.destroy();

    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Upcoming', 'Cancelled', 'Rescheduled'],
        datasets: [{
          data: [18, 4, 2, 2],
          backgroundColor: [C.sage, C.teal, C.red, C.orange],
          borderColor: C.white,
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: "'DM Sans',sans-serif", size: 12 },
              color: C.charcoal,
              padding: 16,
              usePointStyle: true,
            }
          },
          tooltip: {
            backgroundColor: C.charcoal,
            titleColor: C.white,
            bodyColor: 'rgba(255,255,255,0.8)',
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed} sessions`,
            }
          }
        }
      }
    });

    canvas._chartInstance = chart;
    return chart;
  }

  /* ----------------------------------------------------------
     5. REVENUE LINE CHART (Admin Dashboard)
     ---------------------------------------------------------- */
  function initRevenueChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;
    if (canvas._chartInstance) canvas._chartInstance.destroy();

    const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    const revenue = [14200, 15600, 13800, 16900, 17100, 18450];
    const prevYear = [11800, 12400, 12100, 13700, 14200, 15800];

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue 2024',
            data: revenue,
            borderColor: C.sage,
            backgroundColor: C.sageFaint,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: C.sage,
            pointBorderColor: C.white,
            pointBorderWidth: 2,
            pointRadius: 5,
          },
          {
            label: 'Revenue 2023',
            data: prevYear,
            borderColor: C.grey,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [4, 2],
            fill: false,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: C.grey,
          }
        ]
      },
      options: baseOptions({
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey } },
          y: {
            ticks: {
              font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey,
              callback: v => '$' + (v / 1000).toFixed(0) + 'k'
            }
          }
        }
      }),
    });

    canvas._chartInstance = chart;
    return chart;
  }

  /* ----------------------------------------------------------
     6. WEEKLY APPOINTMENTS BAR (Admin Dashboard)
     ---------------------------------------------------------- */
  function initWeeklyAppointmentsChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;
    if (canvas._chartInstance) canvas._chartInstance.destroy();

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Appointments',
          data: [18, 22, 24, 20, 23, 12],
          backgroundColor: [C.sageMid, C.sageMid, C.sage, C.sageMid, C.sageMid, C.tealMid],
          borderColor: [C.sage, C.sage, C.sage, C.sage, C.sage, C.teal],
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: baseOptions({
        plugins: { legend: { display: false }, tooltip: baseOptions().plugins.tooltip },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey } },
          y: { min: 0, max: 30, ticks: { stepSize: 6, font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey } }
        }
      }),
    });

    canvas._chartInstance = chart;
    return chart;
  }

  /* ----------------------------------------------------------
     7. THERAPIST PERFORMANCE BAR (Admin Dashboard)
     ---------------------------------------------------------- */
  function initTherapistChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;
    if (canvas._chartInstance) canvas._chartInstance.destroy();

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Dr. Mitchell', 'Dr. Chen', 'Dr. Sharma', 'Dr. Torres', 'Dr. Watson', 'Dr. Kim'],
        datasets: [{
          label: 'Sessions This Month',
          data: [52, 48, 44, 46, 38, 50],
          backgroundColor: [C.sage, C.teal, C.sageMid, C.tealMid, C.sage, C.teal],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        ...baseOptions({ plugins: { legend: { display: false } } }),
        indexAxis: 'y',
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.grey } },
          y: { grid: { display: false }, ticks: { font: { family: "'DM Sans',sans-serif", size: 11 }, color: C.charcoal } }
        }
      },
    });

    canvas._chartInstance = chart;
    return chart;
  }

  /* ----------------------------------------------------------
     AUTO-INIT: scan for canvas elements on DOM ready
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Auto-init by canvas ID convention
    const idMap = {
      'chart-recovery':     initRecoveryChart,
      'chart-sessions':     initSessionChart,
      'chart-pain-tracker': initPainTracker,
      'chart-appointments': initAppointmentDonut,
      'chart-revenue':      initRevenueChart,
      'chart-weekly-appts': initWeeklyAppointmentsChart,
      'chart-therapists':   initTherapistChart,
    };

    Object.entries(idMap).forEach(([id, fn]) => {
      if (document.getElementById(id)) fn(id);
    });
  });

  // Public API
  return {
    initRecoveryChart,
    initSessionChart,
    initPainTracker,
    initAppointmentDonut,
    initRevenueChart,
    initWeeklyAppointmentsChart,
    initTherapistChart,
  };
})();
