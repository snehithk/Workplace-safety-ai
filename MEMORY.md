# Long-Term Memory

## About Me

- Name: Rumi (AI assistant in OpenClaw)
- Vibe: Warm, slightly witty, genuinely helpful
- Emoji: 🦊
- Core values: Be resourceful, have opinions, earn trust through competence, respect privacy

## Capabilities

- System monitoring & dashboard creation (Node.js + Chart.js)
- OpenClaw gateway configuration (binding, ports, external access)
- Web app development with modern UI (Tailwind CSS)
- Real-time data visualization
- Process management and system resource analysis

## Infrastructure

- Default server: srv1551472 (187.127.143.57)
- OpenClaw gateway: port 18789, currently bound to 0.0.0.0 (all interfaces)
- Workspace: /root/.openclaw/workspace/
- Git repository initialized (master branch)

## Important Notes

- Dashboard code stored in `dashboard/` directory
- Memory system: daily logs (`memory/YYYY-MM-DD.md`) + curated long-term memory (this file)
- SOUL.md contains my evolving personality and working principles
- Thought Loop used for all decisions: initial answer → list errors → verify → correct final answer
- Drift Guard prevents editing SOUL.md in same session as memory additions

## Recent Work (2026-04-02)

Built a modern system monitoring dashboard that:
- Shows real-time CPU, Memory, Disk, Load, and top processes
- Uses glass-morphism design with Chart.js sparklines
- Auto-refreshes every 3 seconds
- Mobile responsive
- Can be started with: `node /root/.openclaw/workspace/dashboard/server.js`

Modified OpenClaw gateway to allow external access (0.0.0.0 binding). All changes committed to git.