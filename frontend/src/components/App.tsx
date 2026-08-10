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
  //add LINKS
    return (
      <div>
        <div className='flex justify-center items-center flex-col'>
          <h3>Coding Contest Tracker</h3>
          <h5>Refreshes twice a day at 00:00 and 12:00 Malaysian Time UTC +8</h5>
          <div className='inline'>
            <label>Selected platforms: </label>
            <select value={filterPlatform} onChange={(e)=>setFilterPlatform(e.target.value as platforms)}>
              <option value={"All"}>All</option>
              <option value={"Codeforces"}>Codeforces</option>
              <option value={"CodeChef"}>CodeChef</option>
              <option value={"AtCoder"}>AtCoder</option>
              <option value={"LeetCode"}>LeetCode</option>
            </select>
          </div>
          {contests !== null && (
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Contest Name</th>
                  <th>Starting Time</th>
                  <th>Contest Duration</th>
                  <th>Time until start (DAY:MINUTE:SECOND)</th>
                </tr>
              </thead>
              <tbody>
                {(filterPlatform === 'LeetCode' || filterPlatform === 'All') && contests['LeetCode']['data']['topTwoContests'].map((item:any,idx:any)=>(
                  <tr key={'LeetCode' + String(idx)}>
                    <td className='flex items-center'> <img className='w-10 h-10' src={LeetCodeSVG} />LeetCode</td>
                    <td>{item.title}<a target='_blank' href={createLink('LeetCode',item.titleSlug)}><img className='inline' src={NewTabSVG} /></a></td>
                    <td>{new Date(item.startTime * 1000).toISOString()}</td>
                    <td>{item.duration / 60} minutes</td>
                    <td>{timeUntilStart((Date.parse(new Date(item.startTime * 1000).toISOString())),item.duration * 1000)}</td>
                  </tr>
                ))}
                {(filterPlatform === 'AtCoder' || filterPlatform === 'All') && contests['AtCoder'].map((item:any,idx:any)=>(
                  <tr key={'AtCoder' + String(idx)}>
                    <td className='flex items-center'> <img className='w-10 h-10' src={AtCoderSVG} />AtCoder</td>
                    <td>{item.title}<a target='_blank' href={createLink("AtCoder",item.title)}><img className='inline' src={NewTabSVG} /></a></td>
                    <td>{new Date(item.start_epoch_second * 1000).toISOString()}</td>
                    <td>{item.duration_second / 60} minutes</td>
                    <td>{timeUntilStart((Date.parse(new Date(item.start_epoch_second * 1000).toISOString())),item.duration_second * 1000)}</td>
                  </tr>
                ))}
                {(filterPlatform === 'CodeChef' || filterPlatform === 'All') && contests['CodeChef'].map((item:any,idx:any)=>(
                  <tr key={'CodeChef' + String(idx)}>
                    <td className='flex items-center'><img className='w-10 h-10' src={CodeChefSVG}/>CodeChef </td>
                    <td>{item.contest_name}<a target='_blank' href={createLink("CodeChef",item.contest_code)}><img className='inline' src={NewTabSVG} /></a></td>
                    <td>{item.contest_start_date_iso}</td>
                    <td>{item.contest_duration} minutes</td>
                    <td>{timeUntilStart(Date.parse(item.contest_start_date_iso),item.contest_duration * 60 * 1000)}</td>
                  </tr>
                ))}
                {(filterPlatform === 'Codeforces' || filterPlatform === 'All') && contests['Codeforces'].map((item:any,idx:any)=>(
                  <tr key={"Codeforces" + String(idx)}>
                    <td className='flex items-center'><img className='w-10 h-10' src={CodeforcesSVG}/>Codeforces</td>
                    <td>{item.name}<a target='_blank' href={createLink('Codeforces',item.id,Date.parse(new Date(item.startTimeSeconds * 1000).toISOString()),item.durationSeconds * 1000)}><img className='inline' src={NewTabSVG} /></a></td>
                    <td>{new Date(item.startTimeSeconds * 1000).toISOString()}</td>
                    <td>{item.durationSeconds / 60} minutes</td>
                    <td>{timeUntilStart((Date.parse(new Date(item.startTimeSeconds * 1000).toISOString())),item.durationSeconds * 1000)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {toast.msg.length > 0 && <Toast msg={toast.msg} ok={toast.ok} />}
        <Github repo={"A"} />
      </div>
    )
}