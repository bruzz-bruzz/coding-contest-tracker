const inviteUrl = 'https://discord.com/oauth2/authorize?client_id=1375687808571805696&permissions=19456&integration_type=0&scope=bot+applications.commands'
import demoIMG from '../assets/demo.png'
import Github from './Github'
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

const commands = ['/about', '/contests', '/help']

export default function Discord() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-bold tracking-tight text-slate-50">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 via-sky-400 to-teal-300 text-lg font-black text-slate-950 shadow-lg shadow-indigo-500/30">
              CC
            </div>
            <span className="text-lg sm:text-xl">Coding Contest Tracker</span>
          </div>

          <a
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Add to Discord
          </a>
        </header>

        <main className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">
              Discord bot
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
              Keep your community in sync with every coding contest.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Add the Coding Contest Tracker bot to your server to automatically surface upcoming contests
              from Codeforces, CodeChef, AtCoder, and LeetCode with direct links and countdowns for your members.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={inviteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5"
              >
                Add to your server
              </a>
              <a
                href="https://coding-contest-tracker-one.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-5 text-sm font-bold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Open contest dashboard
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-4 text-sm text-sky-100/90">
              <li className="flex items-center gap-2 before:text-lg before:text-cyan-300 before:content-['•']">4 contest platforms</li>
              <li className="flex items-center gap-2 before:text-lg before:text-cyan-300 before:content-['•']">Instant invite</li>
              <li className="flex items-center gap-2 before:text-lg before:text-cyan-300 before:content-['•']">Server-ready commands</li>
            </ul>
          </div>

          <div className="relative min-h-[500px] rounded-[28px] border border-slate-700/80 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/50">
            <div className="flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-700/70 bg-slate-950/90">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span>Demo</span>
              </div>

                <div className="flex items-center justify-center p-5">
                  <div className="w-full rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <img className='rounded-lg scale-125' src={demoIMG}/>
            </div>
          </div>
          </div>
          </div>
        </main>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-indigo-500/10 text-xl text-indigo-300">
                ✦
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
              <p className="leading-7 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
            <h2 className="mb-4 text-2xl font-bold text-white">Built for simple server use</h2>
            <ul className="flex flex-wrap gap-2">
              {commands.map((command) => (
                <li
                  key={command}
                  className="rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-3 py-2 font-mono text-sm font-semibold text-indigo-100"
                >
                  {command}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
            <h2 className="mb-4 text-2xl font-bold text-white">Perfect for coding communities</h2>
            <p className="mb-5 leading-7 text-slate-300">
              Whether you run a competitive programming club, a study server, or a casual dev community,
              this bot helps members stay on top of the newest contest opportunities with zero friction.
            </p>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5"
            >
              Add the bot now
            </a>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Made for developers who want faster contest awareness.</span>
          <span>Discord • Codeforces • CodeChef • AtCoder • LeetCode</span>
        </footer>
      </div>
      <Github repo={"https://github.com/bruzz-bruzz/coding-contest-tracker"}/>
    </div>
  )
}
