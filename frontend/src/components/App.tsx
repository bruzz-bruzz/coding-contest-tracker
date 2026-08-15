import './App.css'
import Github from './Github'
import Toast from './Toast'
import Select from './Select'
import NewTabSVG from '../assets/NewTab.svg'
import CodeChefSVG from '../assets/CodeChef.svg'
import AtCoderSVG from '../assets/AtCoder.svg'
import LeetCodeSVG from '../assets/LeetCode.svg'
import CodeforcesSVG from '../assets/Codeforces.svg'
import {useState,useEffect} from 'react'
import axios from 'axios'
export default function App(){
  type platforms = 'All'|'Codeforces'|'CodeChef'|'AtCoder'|'LeetCode'
  const urlMap = {
    'LeetCode':"https://leetcode.com/contest",
    "AtCoder":"https://atcoder.jp/contests",
    "CodeChef":"https://www.codechef.com",
    "Codeforces":"https://codeforces.com/contest"
  }
  const [currTime,setCurrTime] = useState(Date.now())
  const [filterPlatform,setFilterPlatform] = useState<platforms>("All")
  const [contests,setContests] = useState<any | null>(null)
  const [toast,setToast] = useState({msg:'',ok:false})
  const [loading,setLoading] = useState<boolean>(true)
  const [error,setError] = useState<string | null>(null)
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
      const matchType = contestID.match("Heuristic") || contestID.match("Beginner") || contestID.match("Regular") || contestID.match("Grand")
      if(matchType === null){
        return baseURL
      } else if(matchType[0] === 'Heuristic'){
        return `${baseURL}/ahc${numberID[numberID.length - 1]}`
      } else if(matchType[0] === 'Beginner'){
        return `${baseURL}/abc${numberID[numberID.length - 1]}`
      } else if(matchType[0] === 'Regular'){
        return `${baseURL}/arc${numberID[numberID.length - 1]}`
      } else if(matchType[0] === "Grand"){
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
    setLoading(true)
    setError(null)
    try{
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/all`)
      let payload: any = res.data
      // Redis-backed server may return a JSON string or an envelope { data, ok }
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload)
        } catch (err) {
          // keep as-is
        }
      }
      if (payload && payload.data) {
        payload = payload.data
      }
      setContests(payload)
    }catch(e:any){
      const msg = e?.message || 'An error occured'
      setToast({msg,ok:false})
      setError(error)
      setError(msg)
    } finally {
      setLoading(false)
      clearToast()
    }
  }
  useEffect(()=>{
    const interval = setInterval(()=>{
      setCurrTime(Date.now())
    },1000)
    return () => clearInterval(interval)
  },[])
  useEffect(()=>{
    getContestData()
  },[])
    return (
      <div className="app">
        <div className='flex justify-center items-center flex-col'>
          <h3>Coding Contest Tracker</h3>
          <h5>Refreshes four times a day at 00:00, 06:00, 12:00 and 18:00 Malaysian Time UTC +8</h5>
          <div className='inline flex items-center'>
            <label className='text-sm text-slate-300 mr-2'>Selected platforms:</label>
            <Select
              className="ml-2"
              options={["All", "Codeforces", "CodeChef", "AtCoder", "LeetCode"]}
              value={filterPlatform}
              onChange={(v) => setFilterPlatform(v as platforms)}
            />
          </div>
          {loading && (
            <div className="loading">
              <div className="spinner" />
              <div className="loading-text">Loading contests…</div>
            </div>
          )}

          {contests !== null && (
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Contest Name</th>
                  <th>Starting Time</th>
                  <th>Contest Duration</th>
                  <th>Time until start</th>
                </tr>
              </thead>
              <tbody>
                {(filterPlatform === 'LeetCode' || filterPlatform === 'All') && contests['LeetCode']['data']['topTwoContests'].map((item:any,idx:any)=>(
                  <tr key={'LeetCode' + String(idx)}>
                    <td className='flex items-center'> <img className='w-10 h-10' src={LeetCodeSVG} />LeetCode</td>
                    <td>{item.title}<a target='_blank' href={createLink('LeetCode',item.titleSlug)}><img className='inline' src={NewTabSVG} /></a></td>
                    <td>{new Date(item.startTime * 1000).toLocaleString()}</td>
                    <td>{minutesToHours(item.duration / 60)}</td>
                    <td>{timeUntilStart((Date.parse(new Date(item.startTime * 1000).toISOString())),item.duration * 1000)}</td>
                  </tr>
                ))}
                {(filterPlatform === 'AtCoder' || filterPlatform === 'All') && contests['AtCoder'].map((item:any,idx:any)=>(
                  <tr key={'AtCoder' + String(idx)}>
                    <td className='flex items-center'> <img className='w-10 h-10' src={AtCoderSVG} />AtCoder</td>
                    <td>{item.title}<a target='_blank' href={createLink("AtCoder",item.title)}><img className='inline' src={NewTabSVG} /></a></td>
                    <td>{new Date(item.start_epoch_second * 1000).toLocaleString()}</td>
                    <td>{minutesToHours(item.duration_second / 60)}</td>
                    <td>{timeUntilStart((Date.parse(new Date(item.start_epoch_second * 1000).toISOString())),item.duration_second * 1000)}</td>
                  </tr>
                ))}
                {(filterPlatform === 'CodeChef' || filterPlatform === 'All') && contests['CodeChef'].map((item:any,idx:any)=>(
                  <tr key={'CodeChef' + String(idx)}>
                    <td className='flex items-center'><img className='w-10 h-10' src={CodeChefSVG}/>CodeChef </td>
                    <td>{item.contest_name}<a target='_blank' href={createLink("CodeChef",item.contest_code)}><img className='inline' src={NewTabSVG} /></a></td>
                    <td>{new Date(Date.parse(item.contest_start_date_iso)).toLocaleString()}</td>
                    <td>{minutesToHours(item.contest_duration)}</td>
                    <td>{timeUntilStart(Date.parse(item.contest_start_date_iso),item.contest_duration * 60 * 1000)}</td>
                  </tr>
                ))}
                {(filterPlatform === 'Codeforces' || filterPlatform === 'All') && contests['Codeforces'].map((item:any,idx:any)=>(
                  <tr key={"Codeforces" + String(idx)}>
                    <td className='flex items-center'><img className='w-10 h-10' src={CodeforcesSVG}/>Codeforces</td>
                    <td>{item.name}<a target='_blank' href={createLink('Codeforces',item.id,Date.parse(new Date(item.startTimeSeconds * 1000).toISOString()),item.durationSeconds * 1000)}><img className='inline' src={NewTabSVG} /></a></td>
                    <td>{new Date(item.startTimeSeconds * 1000).toLocaleString()}</td>
                    <td>{minutesToHours(item.durationSeconds / 60)}</td>
                    <td>{timeUntilStart((Date.parse(new Date(item.startTimeSeconds * 1000).toISOString())),item.durationSeconds * 1000)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {toast.msg.length > 0 && <Toast msg={toast.msg} ok={toast.ok} />}
          <Github repo={"https://github.com/bruzz-bruzz/coding-contest-tracker"} />
          <h3><a href="https://github.com/bruzz-bruzz/coding-contest-tracker/blob/main/PRIVACY.md">Privacy Policy</a></h3>
          <h3><a href="https://github.com/bruzz-bruzz/coding-contest-tracker/blob/main/TOS.md">Terms of Service</a></h3>
        </div>
      </div>
    )
}