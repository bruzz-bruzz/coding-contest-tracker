import express,{Request,Response} from 'express'
import cron from 'node-cron'
import {Redis} from '@upstash/redis'
import {rateLimit} from 'express-rate-limit'
import dotenv from 'dotenv'
import { getLeetCodeData } from './routes/Leetcode'
import { getAtcoderData } from './routes/Atcoder'
import { getCodechefData } from './routes/Codechef'
import { getCodeforcesData } from './routes/Codeforces'
dotenv.config()
type returnFormat = {
    data:any,
    ok:boolean
}
const app = express()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 50,
    message: 'Too many requests from this IP, please try again later.',
    legacyHeaders: false, 
})
async function convertToJSON(){
    const [atcoder,leetcode,codechef,codeforces] = [await getAtcoderData(),await getLeetCodeData(),await getCodechefData(),await getCodeforcesData()]
    const contestJSON = {
        'AtCoder': atcoder[0],
        'LeetCode':leetcode[0],
        'CodeChef':codechef[0],
        'Codeforces':codeforces[0]
    }
    return contestJSON
}
cron.schedule('0 */12 * * *',async ()=>{
    const obj = await convertToJSON()
    await redis.set('contestData',JSON.stringify(obj))
})
app.get('/all',async(req:Request,res:Response<returnFormat>)=>{
    try{
        const response = await redis.get('contestData')
        if(response === null){
            const obj = await convertToJSON()
            await redis.set('contestData',JSON.stringify(obj))
            return res.json({data:obj,ok:true})
        }
        return res.json({data:response,ok:true})
    }catch(e){
        return res.json({data:[],ok:false})
    }
})
app.listen(3000)