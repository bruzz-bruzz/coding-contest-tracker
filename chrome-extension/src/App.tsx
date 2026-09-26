import { useState, useEffect } from 'react'
import { ExternalLink, Trophy, Code, Laptop, Terminal, Github } from 'lucide-react'

type Platform = 'All' | 'Codeforces' | 'CodeChef' | 'AtCoder' | 'LeetCode'

interface Contest {
  platform: Platform
  title: string
  startTime: number
  duration: number // in minutes
  link: string
}

const placeholderContests: Contest[] = [
  { platform: 'LeetCode', title: 'Weekly Contest 417', startTime: Date.now() + 86400000, duration: 90, link: 'https://leetcode.com/contest' },
  { platform: 'Codeforces', title: 'Codeforces Round 974 (Div. 3)', startTime: Date.now() + 3600000 * 5, duration: 135, link: 'https://codeforces.com/contest' },
  { platform: 'AtCoder', title: 'AtCoder Beginner Contest 373', startTime: Date.now() + 7200000, duration: 100, link: 'https://atcoder.jp/contests' },
  { platform: 'CodeChef', title: 'Starters 153 (Div. 4)', startTime: Date.now() + 172800000, duration: 120, link: 'https://www.codechef.com' },
];

function formatTimeUntil(startTime: number) {
  const diff = startTime - Date.now();
  if (diff <= 0) return 'Started.';
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / (3600 * 24));
  const h = Math.floor(s / 3600) % 24;
  const m = Math.floor(s / 60) % 60;
  const sec = s % 60;
  return `${d}d ${h}h ${m}m ${sec}s`;
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} hour(s) ${m} minute(s)`;
}

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  switch (platform) {
    case 'Codeforces': return <Terminal size={18} className="text-blue-400" />;
    case 'CodeChef': return <Code size={18} className="text-orange-400" />;
    case 'AtCoder': return <Laptop size={18} className="text-red-400" />;
    case 'LeetCode': return <Trophy size={18} className="text-yellow-400" />;
    default: return null;
  }
}


function App() {
  const [filter, setFilter] = useState<Platform>('All');
  const [currTime, setCurrTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const contests = filter === 'All' ? placeholderContests : placeholderContests.filter(c => c.platform === filter);

  return (
    <div className="bg-[#0f172a] text-[#e6eef8] min-h-[500px] w-[750px] overflow-hidden">
      <div className="p-8 bg-gradient-to-b from-[#0f172a] via-[#071032] to-[#021026] min-h-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-3xl font-bold tracking-tight mb-1">Contests</h3>
            <h5 className="text-[#9fb0d6] font-medium">Check out upcoming contests</h5>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#9fb0d6]">Filter:</span>
            <select 
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Platform)}
            >
              <option value="All" className="bg-[#1e293b]">All Platforms</option>
              <option value="Codeforces" className="bg-[#1e293b]">Codeforces</option>
              <option value="CodeChef" className="bg-[#1e293b]">CodeChef</option>
              <option value="AtCoder" className="bg-[#1e293b]">AtCoder</option>
              <option value="LeetCode" className="bg-[#1e293b]">LeetCode</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-white/5 to-white/[0.01]">
                <th className="px-5 py-4 text-[#cfe6ff] font-semibold text-sm">Platform</th>
                <th className="px-5 py-4 text-[#cfe6ff] font-semibold text-sm">Contest</th>
                <th className="px-5 py-4 text-[#cfe6ff] font-semibold text-sm">Starting Time</th>
                <th className="px-5 py-4 text-[#cfe6ff] font-semibold text-sm">Duration</th>
                <th className="px-5 py-4 text-[#cfe6ff] font-semibold text-sm">Time until start</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {contests.map((c, i) => (
                <tr key={i} className="border-t border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                        <PlatformIcon platform={c.platform} />
                      </div>
                      <span className="font-medium">{c.platform}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium">
                    <div className="flex items-center gap-1.5">
                      {c.title}
                      <a href={c.link} target="_blank" rel="noreferrer" className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#9fb0d6] font-medium">
                    {new Date(c.startTime).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-[#9fb0d6] font-medium">
                    {formatDuration(c.duration)}
                  </td>
                  <td className="px-5 py-3 font-mono text-[#7dd3fc]">
                    {formatTimeUntil(c.startTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
          <a 
            href="https://github.com/bruzz-bruzz/coding-contest-tracker" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors"
          >
            <Github size={16} />
            bruzz-bruzz/coding-contest-tracker
          </a>
        </div>
      </div>
    </div>
  )
}


export default App
