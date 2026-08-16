const inviteUrl =
  import.meta.env.VITE_DISCORD_INVITE_URL ||
  'https://discord.com/oauth2/authorize?client_id=YOUR_DISCORD_CLIENT_ID&permissions=274877908736&scope=bot+applications.commands'

const features = [
  {
    title: 'Contest alerts',
    description: 'Send upcoming coding contests directly into your Discord server without leaving chat.',
  },
  {
    title: 'Multi-platform coverage',
    description: 'Track Codeforces, CodeChef, AtCoder, and LeetCode in one place.',
  },
  {
    title: 'Quick links',
    description: 'Every contest card opens directly to the relevant page in one click.',
  },
]

const commands = [
  '/about',
  '/contests',
  '/help',
]

export default function Discord() {
  return (
    <div className="discord-landing">
      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        html, body, #root {
          margin: 0;
          min-height: 100%;
          min-height: 100vh;
          background: #070b17;
          font-family: Inter, 'Segoe UI', sans-serif;
        }

        body {
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(71, 85, 255, 0.28), transparent 32%),
            linear-gradient(180deg, #08101d 0%, #0b1020 42%, #091321 100%);
          color: #edf4ff;
        }

        a {
          text-decoration: none;
        }

        .discord-landing {
          min-height: 100vh;
          padding: 32px 18px 56px;
        }

        .discord-shell {
          max-width: 1180px;
          margin: 0 auto;
        }

        .discord-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
          padding: 8px 0;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #7c9cff 0%, #5eead4 100%);
          color: #08101d;
          font-size: 1.2rem;
          box-shadow: 0 16px 40px rgba(109, 123, 255, 0.45);
        }

        .nav-link {
          color: rgba(237, 244, 255, 0.72);
          font-size: 0.95rem;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(15, 23, 42, 0.35);
        }

        .hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 36px;
          align-items: center;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(94, 234, 212, 0.3);
          background: rgba(16, 185, 129, 0.1);
          color: #a7f3d0;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h1 {
          margin: 18px 0 18px;
          font-size: clamp(2.6rem, 4vw, 5rem);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .hero-copy p {
          margin: 0;
          max-width: 630px;
          color: rgba(226, 232, 240, 0.82);
          font-size: 1.08rem;
          line-height: 1.7;
        }

        .cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 26px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 20px;
          border-radius: 14px;
          font-weight: 700;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .button:hover {
          transform: translateY(-1px);
        }

        .button.primary {
          background: linear-gradient(135deg, #7c9cff, #8b5cf6);
          color: white;
          box-shadow: 0 18px 32px rgba(124, 156, 255, 0.35);
        }

        .button.secondary {
          color: #edf4ff;
          border: 1px solid rgba(148, 163, 184, 0.28);
          background: rgba(15, 23, 42, 0.5);
        }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          list-style: none;
          padding: 0;
          margin: 26px 0 0;
          color: rgba(191, 219, 254, 0.9);
          font-size: 0.94rem;
        }

        .hero-meta li {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .hero-meta li:before {
          content: '•';
          color: #67e8f9;
          font-size: 1.3rem;
        }

        .mockup {
          position: relative;
          min-height: 520px;
          border-radius: 28px;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(8, 14, 29, 0.96));
          border: 1px solid rgba(148, 163, 184, 0.18);
          box-shadow: 0 26px 70px rgba(3, 7, 18, 0.7);
          padding: 18px;
        }

        .discord-window {
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: rgba(12, 19, 31, 0.95);
        }

        .window-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(148,163,184,0.18);
          background: rgba(15,23,42,0.7);
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot.red { background: #f87171; }
        .dot.yellow { background: #fbbf24; }
        .dot.green { background: #34d399; }

        .channel-list {
          padding: 18px 16px;
          border-right: 1px solid rgba(148,163,184,0.12);
          background: rgba(9, 12, 22, 0.9);
        }

        .channel-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 10px;
          color: rgba(203, 213, 225, 0.96);
          background: rgba(148, 163, 184, 0.06);
          margin-bottom: 10px;
          font-weight: 600;
        }

        .channel-pill.active {
          background: rgba(124, 156, 255, 0.16);
          color: #e2e8ff;
        }

        .server-body {
          display: grid;
          grid-template-columns: 180px 1fr;
          flex: 1;
        }

        .message-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 18px;
          gap: 16px;
        }

        .bot-card {
          padding: 16px;
          border-radius: 16px;
          background: rgba(124, 156, 255, 0.08);
          border: 1px solid rgba(124, 156, 255, 0.2);
        }

        .bot-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .bot-avatar {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #7c9cff, #5eead4);
          color: #08101d;
          font-weight: 800;
        }

        .bot-card h3 {
          margin: 0;
          font-size: 1.05rem;
        }

        .tag {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(52, 211, 153, 0.15);
          color: #a7f3d0;
        }

        .contest-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.12);
        }

        .contest-row strong {
          display: block;
          margin-bottom: 4px;
        }

        .contest-row span {
          color: rgba(191, 219, 254, 0.8);
          font-size: 0.82rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 72px;
        }

        .feature-card,
        .command-panel,
        .info-banner {
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.25);
        }

        .feature-card {
          padding: 24px;
        }

        .feature-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(124, 156, 255, 0.15);
          margin-bottom: 18px;
          font-size: 1.3rem;
        }

        .feature-card h3 {
          margin: 0 0 12px;
          font-size: 1.18rem;
        }

        .feature-card p {
          margin: 0;
          color: rgba(226, 232, 240, 0.78);
          line-height: 1.7;
        }

        .bottom-section {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          margin-top: 28px;
          align-items: stretch;
        }

        .command-panel {
          padding: 24px;
        }

        .command-panel h2,
        .info-banner h2 {
          margin: 0 0 16px;
          font-size: 1.45rem;
        }

        .command-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .command-list li {
          padding: 8px 10px;
          border-radius: 10px;
          background: rgba(124, 156, 255, 0.1);
          border: 1px solid rgba(124, 156, 255, 0.2);
          color: #dbe8ff;
          font-weight: 700;
          font-family: 'SFMono-Regular', Consolas, monospace;
        }

        .info-banner {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 24px;
        }

        .info-banner p {
          margin: 0 0 18px;
          color: rgba(226, 232, 240, 0.82);
          line-height: 1.7;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding-top: 22px;
          margin-top: 34px;
          border-top: 1px solid rgba(148, 163, 184, 0.12);
          color: rgba(191, 219, 254, 0.75);
          font-size: 0.92rem;
        }

        @media (max-width: 900px) {
          .hero,
          .bottom-section,
          .feature-grid {
            grid-template-columns: 1fr;
          }

          .discord-topbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .discord-landing {
            padding-inline: 14px;
          }

          .server-body {
            grid-template-columns: 1fr;
          }

          .channel-list {
            border-right: none;
            border-bottom: 1px solid rgba(148,163,184,0.12);
          }

          .cta-row {
            flex-direction: column;
          }

          .button {
            width: 100%;
          }
        }
      `}</style>

      <div className="discord-shell">
        <header className="discord-topbar">
          <div className="brand">
            <span className="brand-mark">CC</span>
            <span>Coding Contest Tracker</span>
          </div>
          <a className="nav-link" href={inviteUrl} target="_blank" rel="noreferrer">
            Add to Discord
          </a>
        </header>

        <main className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Discord bot</span>
            <h1>Keep your community in sync with every coding contest.</h1>
            <p>
              Add the Coding Contest Tracker bot to your server to automatically surface upcoming contests
              from Codeforces, CodeChef, AtCoder, and LeetCode with direct links and countdowns for your members.
            </p>

            <div className="cta-row">
              <a className="button primary" href={inviteUrl} target="_blank" rel="noreferrer">
                Add to your server
              </a>
              <a className="button secondary" href="/" target="_blank" rel="noreferrer">
                Open contest dashboard
              </a>
            </div>

            <ul className="hero-meta">
              <li>4 contest platforms</li>
              <li>Instant invite</li>
              <li>Server-ready commands</li>
            </ul>
          </div>

          <div className="mockup" aria-label="Bot preview">
            <div className="discord-window">
              <div className="window-bar">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>

              <div className="server-body">
                <div className="channel-list">
                  <div className="channel-pill active"># contests</div>
                  <div className="channel-pill"># announcements</div>
                  <div className="channel-pill"># help</div>
                </div>

                <div className="message-panel">
                  <div className="bot-card">
                    <div className="bot-header">
                      <div className="bot-avatar">CC</div>
                      <div>
                        <h3>Coding Contest Tracker</h3>
                        <span className="tag">Live</span>
                      </div>
                    </div>

                    <div className="contest-row">
                      <div>
                        <strong>Google Code Jam</strong>
                        <span>Starts in 2d 4h</span>
                      </div>
                      <span>Codeforces</span>
                    </div>

                    <div className="contest-row">
                      <div>
                        <strong>AtCoder Beginner Contest</strong>
                        <span>Starts in 7h 32m</span>
                      </div>
                      <span>AtCoder</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <section className="feature-grid" aria-label="Bot features">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">✦</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="bottom-section">
          <div className="command-panel">
            <h2>Built for simple server use</h2>
            <ul className="command-list">
              {commands.map((command) => (
                <li key={command}>{command}</li>
              ))}
            </ul>
          </div>

          <div className="info-banner">
            <h2>Perfect for coding communities</h2>
            <p>
              Whether you run a competitive programming club, a study server, or a casual dev community,
              this bot helps members stay on top of the newest contest opportunities with zero friction.
            </p>
            <a className="button primary" href={inviteUrl} target="_blank" rel="noreferrer">
              Add the bot now
            </a>
          </div>
        </section>

        <footer className="footer">
          <span>Made for developers who want faster contest awareness.</span>
          <span>Discord • Codeforces • CodeChef • AtCoder • LeetCode</span>
        </footer>
      </div>
    </div>
  )
}
