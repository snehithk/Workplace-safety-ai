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

## Recent Work (2026-04-02 to 2026-04-03)

**2026-04-02:**
Built a modern system monitoring dashboard (Node.js + Chart.js) with glass-morphism UI, real-time charts, mobile responsiveness. Modified OpenClaw gateway to bind to 0.0.0.0 for external access. All changes committed.

**2026-04-03:**
- Researched & documented Gemma 4 models (E2B, E4B, 26B-A4B, 31B). Determined server (7.8GB RAM) can run E2B or E4B locally.
- Enabled Telegram exec approvals correctly (`channels.telegram.execApprovals` with numeric user ID 6045828445). Tested `/approve` workflow successfully.
- Installed Tailscale for secure private networking. Fixed APT repo issue (removed monarx.list). Currently awaiting user authentication to complete `tailscale up`.
- Next: Configure OpenClaw to use Tailscale, then install Gemma 4 E2B via Ollama for local AI capabilities.

## Configuration Changes

- `/root/.openclaw/openclaw.json`:
  - `gateway.bind`: `0.0.0.0` (accessible on all interfaces)
  - `channels.telegram.execApprovals.enabled`: `true`
  - `channels.telegram.execApprovals.approvers`: `[6045828445]`
  - `channels.telegram.execApprovals.target`: `"dm"`
- Tailscale installed, awaiting activation