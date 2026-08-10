import './App.css'
import Github from './Github'
import Toast from './Toast'
import NewTabSVG from '../assets/NewTab.svg'
import CodeChefSVG from '../assets/CodeChef.svg'
import AtCoderSVG from '../assets/AtCoder.svg'
import LeetCodeSVG from '../assets/LeetCode.svg'
import CodeforcesSVG from '../assets/Codeforces.svg'
import {useState,useEffect} from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios'
export default function App(){
  type platforms = 'All'|'Codeforces'|'CodeChef'|'AtCoder'|'LeetCode'
  const urlMap = {
    'LeetCode':"https://leetcode.com/contest",
    "AtCoder":"https://atcoder.jp/contests",
    "CodeChef":"https://www.codechef.com",
    "Codeforces":"https://codeforces.com/contest"
  }
  const [cookies,setCookies] = useCookies()
  const [currTime,setCurrTime] = useState(Date.now())
  const [filterPlatform,setFilterPlatform] = useState<platforms>("All")
  const [contests,setContests] = useState<any | null>({
  "AtCoder": [
    {
      "start_epoch_second": 1786795200,
      "duration_second": 6000,
      "title": "AtCoder Beginner Contest 471"
    },
    {
      "start_epoch_second": 1786881600,
      "duration_second": 6000,
      "title": "AtCoder Regular Contest 227"
    },
    {
      "start_epoch_second": 1787400000,
      "duration_second": 6000,
      "title": "AtCoder Beginner Contest 472"
    },
    {
      "start_epoch_second": 1787983200,
      "duration_second": 6000,
      "title": "13th Asprova Programming Contest（AtCoder Heuristic Contest 070）"
    },
    {
      "start_epoch_second": 1788004800,
      "duration_second": 6000,
      "title": "AtCoder Beginner Contest 473"
    },
    {
      "start_epoch_second": 1788667800,
      "duration_second": 6000,
      "title": "AtCoder Beginner Contest 474"
    }
  ],
  "LeetCode": {
    "data": {
      "topTwoContests": [
        {
          "title": "Weekly Contest 515",
          "titleSlug": "weekly-contest-515",
          "startTime": 1786847400,
          "duration": 5400
        },
        {
          "title": "Biweekly Contest 189",
          "titleSlug": "biweekly-contest-189",
          "startTime": 1786804200,
          "duration": 5400
        }
      ]
    }
  },
  "CodeChef": [
    {
      "contest_id": "62092",
      "contest_code": "PLACEPREP02",
      "contest_name": "Placement Prep Weekends - 02",
      "contest_start_date": "08 Aug 2026  00:00:00",
      "contest_end_date": "10 Aug 2026  02:59:00",
      "contest_start_date_iso": "2026-08-08T00:00:00+05:30",
      "contest_end_date_iso": "2026-08-10T02:59:00+05:30",
      "contest_duration": "180",
      "distinct_users": 1093
    },
    {
      "contest_id": "67192",
      "contest_code": "DSAMONDAY015",
      "contest_name": "Monday Munch - DSA Challenge 015 (Rated)",
      "contest_start_date": "10 Aug 2026  19:00:00",
      "contest_end_date": "10 Aug 2026  22:00:00",
      "contest_start_date_iso": "2026-08-10T19:00:00+05:30",
      "contest_end_date_iso": "2026-08-10T22:00:00+05:30",
      "contest_duration": "180",
      "distinct_users": 0
    },
    {
      "contest_id": "64030",
      "contest_code": "START251",
      "contest_name": "Starters 251",
      "contest_start_date": "12 Aug 2026  20:00:00",
      "contest_end_date": "12 Aug 2026  22:00:00",
      "contest_start_date_iso": "2026-08-12T20:00:00+05:30",
      "contest_end_date_iso": "2026-08-12T22:00:00+05:30",
      "contest_duration": "120",
      "distinct_users": 0
    }
  ],
  "Codeforces": [
    {
      "id": 2257,
      "name": "Codeforces Round (Div. 2)",
      "type": "CF",
      "phase": "BEFORE",
      "frozen": false,
      "durationSeconds": 7200,
      "startTimeSeconds": 1786977300,
      "relativeTimeSeconds": -694879
    },
    {
      "id": 2251,
      "name": "ICPC 2026 Online Challenge 1 powered by Huawei",
      "type": "IOI",
      "phase": "BEFORE",
      "frozen": false,
      "durationSeconds": 1209600,
      "startTimeSeconds": 1786705200,
      "relativeTimeSeconds": -422779
    },
    {
      "id": 2255,
      "name": "Codeforces Round 1116 (Div. 1)",
      "type": "CF",
      "phase": "BEFORE",
      "frozen": false,
      "durationSeconds": 9000,
      "startTimeSeconds": 1786286100,
      "relativeTimeSeconds": -3679
    },
    {
      "id": 2256,
      "name": "Codeforces Round 1116 (Div. 2)",
      "type": "CF",
      "phase": "BEFORE",
      "frozen": false,
      "durationSeconds": 9000,
      "startTimeSeconds": 1786286100,
      "relativeTimeSeconds": -3679
    }
  ]
})
  const [toast,setToast] = useState({msg:'',ok:false})
  function clearToast(){
    setTimeout(()=>{
      setToast({msg:"",ok:false})
    },3000)
  }
  function timeUntilStart(contestStart:number,contestEnd:number){
    if(currTime > (contestStart + contestEnd)){
      return "Ended."
    }
    const s = Math.floor((contestStart - currTime) / 1000)
    if(s < 0){
      return "Started."
    }
    const second = s % 60
    const m = Math.floor(s / 60) % 60
    const h = Math.floor(s / 3600) % 24
    const d = Math.floor(s / (3600 * 24))
    return `${d}d ${h}h ${m}m ${second}s`
  }
  function minutesToHours(time:number){
    const m = time % 60
    const h = Math.floor(time / 60)
    return `${h} hour(s) ${m} minute(s)`
  }
  function createLink(type:'LeetCode'|"AtCoder"|"CodeChef"|"Codeforces",contestID:string,contestStart?:number,contestEnd?:number){
    const baseURL = urlMap[type]
    if(type === 'LeetCode'){
      return `${baseURL}/${contestID}`
    }else if(type === 'AtCoder'){
      let numberID = contestID.split(' ')
      if(numberID[numberID.length - 1].length !== 3){
        numberID[numberID.length - 1] = numberID[numberID.length - 1].slice(0,3)
      }
      const type = contestID.match("Heuristic") || contestID.match("Beginner") || contestID.match("Regular") || contestID.match("Grand")
      if(type === null){
        return baseURL
      } else if(type[0] === 'Heuristic'){
        return `${baseURL}/ahc${numberID[numberID.length - 1]}`
      } else if(type[0] === 'Beginner'){
        return `${baseURL}/abc${numberID[numberID.length - 1]}`
      } else if(type[0] === 'Regular'){
        return `${baseURL}/arc${numberID[numberID.length - 1]}`
      } else if(type[0] === "Grand"){
        return `${baseURL}/agc${numberID[numberID.length - 1]}`
      }
    }
    else if(type === 'CodeChef'){
      return `${baseURL}/${contestID}`
    } else if(type === 'Codeforces'){
      const hasStartedOrEnded = timeUntilStart(contestStart as number,contestEnd as number)
      if(hasStartedOrEnded !== 'Started.' && hasStartedOrEnded !== 'Ended.'){
        return `${baseURL}s`
      }
      return `${baseURL}/${contestID}`
    }
  }
  async function getContestData(){
    try{
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/all`)
      setContests(res.data)
    }catch(e){
      setToast({msg:"An error occured",ok:false})
    }
    clearToast()
  }
  useEffect(()=>{
    const interval = setInterval(()=>{
      setCurrTime(Date.now())
    },1000)
    return () => clearInterval(interval)
  },[])

const platforms: platforms[] = ['All','Codeforces','CodeChef','AtCoder','LeetCode']

return (
  <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8'>
    <div className='mx-auto flex max-w-7xl flex-col gap-6'>
      <header className='overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 shadow-2xl shadow-slate-950/40 backdrop-blur-xl'>
        <div className='flex flex-col gap-8 px-6 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-10'>
          <div className='max-w-2xl space-y-4'>
            <div className='inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300'>
              Live contest radar
            </div>
            <div className='space-y-3'>
              <h1 className='text-4xl font-semibold tracking-tight text-white sm:text-5xl'>Coding Contest Tracker</h1>
              <p className='text-lg leading-8 text-slate-300'>Stay one step ahead with upcoming contests from Codeforces, CodeChef, AtCoder, and LeetCode in one place.</p>
            </div>
            <p className='text-sm text-slate-400'>Refreshes twice a day at 00:00 and 12:00 Malaysian Time (UTC +8)</p>
          </div>

          <div className='flex flex-wrap gap-2'>
            {platforms.map((platform) => {
              const active = filterPlatform === platform
              return (
                <button
                  key={platform}
                  type='button'
                  onClick={() => setFilterPlatform(platform)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-lg shadow-cyan-500/10' : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:bg-white/10'}`}
                >
                  {platform}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <section className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30 backdrop-blur'>
          <p className='text-sm text-slate-400'>Current view</p>
          <p className='mt-2 text-2xl font-semibold text-white'>{filterPlatform}</p>
        </div>
        <div className='rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30 backdrop-blur'>
          <p className='text-sm text-slate-400'>Live data</p>
          <p className='mt-2 text-2xl font-semibold text-white'>Updated every second</p>
        </div>
        <div className='rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30 backdrop-blur'>
          <p className='text-sm text-slate-400'>Tracking ready</p>
          <p className='mt-2 text-2xl font-semibold text-white'>Contest countdowns enabled</p>
        </div>
      </section>

      <section className='overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 shadow-2xl shadow-slate-950/40 backdrop-blur-xl'>
        <div className='flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-white'>Upcoming contests</h2>
            <p className='mt-1 text-sm text-slate-400'>Tap a contest link to open the official page.</p>
          </div>
          <div className='rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200'>
            {contests !== null ? 'Live schedule' : 'Loading...'}
          </div>
        </div>

        {contests !== null && (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-white/10 text-left text-sm text-slate-300'>
              <thead className='bg-slate-800/70 text-xs uppercase tracking-[0.24em] text-slate-400'>
                <tr>
                  <th className='px-6 py-4 font-medium'>Platform</th>
                  <th className='px-6 py-4 font-medium'>Contest</th>
                  <th className='px-6 py-4 font-medium'>Starting time</th>
                  <th className='px-6 py-4 font-medium'>Duration</th>
                  <th className='px-6 py-4 font-medium'>Time until start</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/10 bg-slate-900/40'>
                {(filterPlatform === 'LeetCode' || filterPlatform === 'All') && contests['LeetCode']['data']['topTwoContests'].map((item:any, idx:any) => (
                  <tr key={'LeetCode' + String(idx)} className='transition-colors hover:bg-white/5'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <img className='h-10 w-10 rounded-lg object-contain' src={LeetCodeSVG} alt='LeetCode logo' />
                        <span className='font-medium text-white'>LeetCode</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <span>{item.title}</span>
                        <a className='rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-cyan-300' target='_blank' rel='noreferrer' href={createLink('LeetCode', item.titleSlug)}>
                          <img className='h-4 w-4' src={NewTabSVG} alt='Open contest' />
                        </a>
                      </div>
                    </td>
                    <td className='px-6 py-4'>{new Date(item.startTime * 1000).toLocaleString()}</td>
                    <td className='px-6 py-4'>{minutesToHours(item.duration / 60)}</td>
                    <td className='px-6 py-4'>{timeUntilStart(Date.parse(new Date(item.startTime * 1000).toISOString()), item.duration * 1000)}</td>
                  </tr>
                ))}
                {(filterPlatform === 'AtCoder' || filterPlatform === 'All') && contests['AtCoder'].map((item:any, idx:any) => (
                  <tr key={'AtCoder' + String(idx)} className='transition-colors hover:bg-white/5'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <img className='h-10 w-10 rounded-lg object-contain' src={AtCoderSVG} alt='AtCoder logo' />
                        <span className='font-medium text-white'>AtCoder</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <span>{item.title}</span>
                        <a className='rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-cyan-300' target='_blank' rel='noreferrer' href={createLink('AtCoder', item.title)}>
                          <img className='h-4 w-4' src={NewTabSVG} alt='Open contest' />
                        </a>
                      </div>
                    </td>
                    <td className='px-6 py-4'>{new Date(item.start_epoch_second * 1000).toLocaleString()}</td>
                    <td className='px-6 py-4'>{minutesToHours(item.duration_second / 60)}</td>
                    <td className='px-6 py-4'>{timeUntilStart(Date.parse(new Date(item.start_epoch_second * 1000).toISOString()), item.duration_second * 1000)}</td>
                  </tr>
                ))}
                {(filterPlatform === 'CodeChef' || filterPlatform === 'All') && contests['CodeChef'].map((item:any, idx:any) => (
                  <tr key={'CodeChef' + String(idx)} className='transition-colors hover:bg-white/5'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <img className='h-10 w-10 rounded-lg object-contain' src={CodeChefSVG} alt='CodeChef logo' />
                        <span className='font-medium text-white'>CodeChef</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <span>{item.contest_name}</span>
                        <a className='rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-cyan-300' target='_blank' rel='noreferrer' href={createLink('CodeChef', item.contest_code)}>
                          <img className='h-4 w-4' src={NewTabSVG} alt='Open contest' />
                        </a>
                      </div>
                    </td>
                    <td className='px-6 py-4'>{new Date(Date.parse(item.contest_start_date_iso)).toLocaleString()}</td>
                    <td className='px-6 py-4'>{minutesToHours(item.contest_duration)}</td>
                    <td className='px-6 py-4'>{timeUntilStart(Date.parse(item.contest_start_date_iso), item.contest_duration * 60 * 1000)}</td>
                  </tr>
                ))}
                {(filterPlatform === 'Codeforces' || filterPlatform === 'All') && contests['Codeforces'].map((item:any, idx:any) => (
                  <tr key={'Codeforces' + String(idx)} className='transition-colors hover:bg-white/5'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <img className='h-10 w-10 rounded-lg object-contain' src={CodeforcesSVG} alt='Codeforces logo' />
                        <span className='font-medium text-white'>Codeforces</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <span>{item.name}</span>
                        <a className='rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-cyan-300' target='_blank' rel='noreferrer' href={createLink('Codeforces', item.id, Date.parse(new Date(item.startTimeSeconds * 1000).toISOString()), item.durationSeconds * 1000)}>
                          <img className='h-4 w-4' src={NewTabSVG} alt='Open contest' />
                        </a>
                      </div>
                    </td>
                    <td className='px-6 py-4'>{new Date(item.startTimeSeconds * 1000).toLocaleString()}</td>
                    <td className='px-6 py-4'>{minutesToHours(item.durationSeconds / 60)}</td>
                    <td className='px-6 py-4'>{timeUntilStart(Date.parse(new Date(item.startTimeSeconds * 1000).toISOString()), item.durationSeconds * 1000)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
    {toast.msg.length > 0 && <Toast msg={toast.msg} ok={toast.ok} />}
    <Github repo={'A'} />
  </div>
)
}