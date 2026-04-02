#!/usr/bin/env node

const http = require('http');
const { exec } = require('child_process');

const PORT = 3000;

const history = {
  cpu: [],
  memory: [],
  load: [],
  maxPoints: 30
};

function getSystemStats() {
  return new Promise((resolve) => {
    exec('top -bn1 | grep "Cpu(s)" | awk \'{print $2}\' | cut -d\'%\' -f1', (err, cpu) => {
      exec('free -m | awk \'/Mem:/ {print $2, $3, $4, $7}\'', (err, mem) => {
        exec('df -h / | awk \'NR==2 {print $2, $3, $4, $5}\'', (err, disk) => {
          exec('uptime', (err, uptime) => {
            exec('cat /proc/loadavg | awk \'{print $1, $2, $3}\'', (err, load) => {
              exec('ps aux --sort=-%cpu | head -6 | tail -5 | awk \'{printf "%s:%s:%.1f%%:%.1f%%\\n", $2, $11, $3, $4}\'', (err, cpuProcs) => {
                exec('ps aux --sort=-%mem | head -6 | tail -5 | awk \'{printf "%s:%s:%.1f%%:%.1f%%\\n", $2, $11, $4, $3}\'', (err, memProcs) => {
                  exec('ip -4 addr show eth0 2>/dev/null | grep -oP \'(?<=inet\\s)\\d+(\\.\\d+){3}\' || echo "127.0.0.1"', (err, ip) => {
                    const cpuVal = parseFloat(cpu ? cpu.trim() : 0) || 0;
                    const memParts = mem ? mem.trim().split(/\s+/) : [];
                    const memPct = memParts.length >= 2 ? Math.round((parseFloat(memParts[1]) / parseFloat(memParts[0])) * 100) : 0;
                    const loadParts = load ? load.trim().split(/\s+/) : [];
                    const load1 = parseFloat(loadParts[0]) || 0;

                    history.cpu.push(cpuVal);
                    history.memory.push(memPct);
                    history.load.push(load1);
                    if (history.cpu.length > history.maxPoints) history.cpu.shift();
                    if (history.memory.length > history.maxPoints) history.memory.shift();
                    if (history.load.length > history.maxPoints) history.load.shift();

                    resolve({
                      cpu: cpuVal,
                      memory: memParts,
                      memoryPct: memPct,
                      memoryUsed: memParts[1] || 'N/A',
                      memoryTotal: memParts[0] || 'N/A',
                      disk: disk ? disk.trim().split(/\s+/) : [],
                      uptime: uptime ? uptime.trim() : 'N/A',
                      load: loadParts,
                      cpuProcs: cpuProcs ? cpuProcs.trim().split('\n') : [],
                      memProcs: memProcs ? memProcs.trim().split('\n') : [],
                      ip: ip ? ip.trim().split('\n')[0] : 'N/A',
                      timestamp: new Date().toISOString(),
                      history: {
                        cpu: [...history.cpu],
                        memory: [...history.memory],
                        load: [...history.load]
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/' || req.url === '/dashboard') {
    const stats = await getSystemStats();
    
    let cpuProcRows = stats.cpuProcs.map(p => {
      if (!p) return '';
      const [pid, cmd, cpu, mem] = p.split(':');
      return `<tr><td class="p-3 text-blue-400 font-mono text-sm">${pid}</td><td class="p-3 text-sm truncate">${cmd}</td><td class="p-3"><div class="bg-gray-700 rounded-full h-2 overflow-hidden"><div class="bg-gradient-to-r from-blue-500 to-cyan-400 h-full" style="width:${cpu}%"></div></div></td><td class="p-3 text-sm">${cpu}</td><td class="p-3 text-sm">${mem}</td></tr>`;
    }).join('');

    let memProcRows = stats.memProcs.map(p => {
      if (!p) return '';
      const [pid, cmd, mem, cpu] = p.split(':');
      return `<tr><td class="p-3 text-purple-400 font-mono text-sm">${pid}</td><td class="p-3 text-sm truncate">${cmd}</td><td class="p-3"><div class="bg-gray-700 rounded-full h-2 overflow-hidden"><div class="bg-gradient-to-r from-purple-500 to-pink-400 h-full" style="width:${mem}%"></div></div></td><td class="p-3 text-sm">${mem}</td><td class="p-3 text-sm">${cpu}</td></tr>`;
    }).join('');

    const memUsed = stats.memory[1] || 'N/A';
    const memTotal = stats.memory[0] || 'N/A';
    const diskUsed = stats.disk[2] || 'N/A';
    const diskTotal = stats.disk[0] || 'N/A';
    const diskPct = stats.disk[3] || 'N/A';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <meta http-equiv="refresh" content="3">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .neon {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
    .truncate { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    @media (max-width: 640px) {
      .truncate { max-width: 60px; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .animate-pulse-slow {
      animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  </style>
</head>
<body class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 min-h-screen p-4">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
          🖥️ System Dashboard
        </h1>
        <p class="text-gray-400 text-sm mt-1">Real-time monitoring · Auto-refresh: 3s</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="glass px-4 py-2 rounded-full flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-sm">Live</span>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-400">Server IP</p>
          <p class="text-sm font-mono text-cyan-400">${stats.ip}</p>
        </div>
      </div>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform neon">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">CPU</p>
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </div>
        <p class="text-4xl font-bold mb-1">${stats.cpu}%</p>
        <p class="text-xs text-gray-500">Load: ${stats.load[0] || '0.00'}</p>
      </div>

      <div class="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform neon" style="animation-delay: 0.1s">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">Memory</p>
          <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        </div>
        <p class="text-4xl font-bold mb-1 text-purple-400">${stats.memoryPct}%</p>
        <p class="text-xs text-gray-500">${stats.memoryUsed} / ${stats.memoryTotal}</p>
      </div>

      <div class="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform neon" style="animation-delay: 0.2s">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">Disk</p>
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
        </div>
        <p class="text-4xl font-bold mb-1 text-green-400">${diskPct}</p>
        <p class="text-xs text-gray-500">${diskUsed} / ${diskTotal}</p>
      </div>

      <div class="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform neon" style="animation-delay: 0.3s">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">Uptime</p>
          <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <p class="text-xl font-bold mb-1 truncate">${stats.uptime.split(' up ')[1] || stats.uptime}</p>
        <p class="text-xs text-gray-500">Last: ${new Date(stats.timestamp).toLocaleTimeString()}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="glass rounded-2xl p-6">
        <h3 class="text-lg font-semibold mb-4 text-blue-400">CPU History</h3>
        <canvas id="cpuChart" height="150"></canvas>
      </div>
      <div class="glass rounded-2xl p-6">
        <h3 class="text-lg font-semibold mb-4 text-purple-400">Memory %</h3>
        <canvas id="memChart" height="150"></canvas>
      </div>
      <div class="glass rounded-2xl p-6">
        <h3 class="text-lg font-semibold mb-4 text-green-400">Load Avg</h3>
        <canvas id="loadChart" height="150"></canvas>
      </div>
    </div>

    <!-- Process Tables -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="glass rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-blue-400">🔥 Top CPU</h3>
          <span class="text-xs bg-blue-900/50 px-2 py-1 rounded">PID · Command</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <tbody>${cpuProcRows || '<tr><td colspan="4" class="p-4 text-gray-400">No data</td></tr>'}</tbody>
          </table>
        </div>
      </div>

      <div class="glass rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-purple-400">💾 Top Memory</h3>
          <span class="text-xs bg-purple-900/50 px-2 py-1 rounded">PID · Command</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <tbody>${memProcRows || '<tr><td colspan="4" class="p-4 text-gray-400">No data</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center text-gray-500 text-sm py-6">
      <p>Powered by OpenClaw · Generated in ${new Date(stats.timestamp).toLocaleTimeString()}</p>
      <p class="mt-1"><a href="/" class="text-cyan-400 hover:underline">Refresh Now</a></p>
    </footer>
  </div>

  <script>
    const colors = {
      blue: 'rgba(59, 130, 246, 0.8)',
      purple: 'rgba(147, 51, 234, 0.8)',
      green: 'rgba(34, 197, 94, 0.8)',
      grid: 'rgba(255, 255, 255, 0.1)'
    };

    const createChart = (ctx, data, color, label, min = 0, max = 100) => {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map((_, i) => i),
          datasets: [{
            label,
            data,
            borderColor: color,
            backgroundColor: color.replace('0.8', '0.2'),
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { 
              min, max,
              grid: { color: colors.grid },
              ticks: { color: '#9ca3af' }
            }
          },
          animation: { duration: 0 }
        }
      });
    };

    const stats = ${JSON.stringify(stats)};
    
    window.onload = () => {
      createChart(document.getElementById('cpuChart'), stats.history.cpu, colors.blue, 'CPU %');
      createChart(document.getElementById('memChart'), stats.history.memory, colors.purple, 'Memory %');
      createChart(document.getElementById('loadChart'), stats.history.load, colors.green, 'Load', 0, Math.max(...stats.history.load, 2));
    };
  </script>
</body>
</html>`;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.url === '/api/stats') {
    const stats = await getSystemStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats, null, 2));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Modern Dashboard running on http://0.0.0.0:${PORT}/`);
  console.log(`📱 Access from phone: http://${require('os').hostname()}:${PORT}/ or http://187.127.143.57:${PORT}/`);
});