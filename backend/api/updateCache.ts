import { Redis } from '@upstash/redis';
import { Receiver } from '@upstash/qstash';
import {Request,Response} from 'express'
import { getLeetCodeData } from '../src/routes/Leetcode'
import { getAtcoderData } from '../src/routes/Atcoder'
import { getCodechefData } from '../src/routes/Codechef'
import { getCodeforcesData } from '../src/routes/Codeforces'
import dotenv from 'dotenv';
dotenv.config();
const redis = Redis.fromEnv();
const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});
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
export default async function handler(req:Request, res:Response) {
  const isValid = await receiver.verify({
    signature: req.headers["upstash-signature"] as string,
    body: JSON.stringify(req.body || ""),
    url: `https://${req.headers.host}${req.url}`,
  }).catch(() => false);

  if (!isValid) return res.status(401).json({ error: "Unauthorized" });
  const contestData = await convertToJSON();
  await redis.set('contestData', JSON.stringify(contestData));

  return res.status(200).json({ success: true });
}