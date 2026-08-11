import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv'
import {Redis} from '@upstash/redis'
import { getLeetCodeData } from './routes/Leetcode'
import { getAtcoderData } from './routes/Atcoder'
import { getCodechefData } from './routes/Codechef'
import { getCodeforcesData } from './routes/Codeforces'
dotenv.config()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
async function convertToJSON(){
    const [atcoder, leetcode, codechef, codeforces] = await Promise.all([
    getAtcoderData(),
    getLeetCodeData(),
    getCodechefData(),
    getCodeforcesData()
  ]);
    const contestJSON = {
        'AtCoder': atcoder[0],
        'LeetCode':leetcode[0],
        'CodeChef':codechef[0],
        'Codeforces':codeforces[0]
    }
    return contestJSON
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const obj = await convertToJSON()
    await redis.set('contestData',JSON.stringify(obj))
  return res.status(200).json({ success: true, message: "Cron 1 executed successfully" });
}
