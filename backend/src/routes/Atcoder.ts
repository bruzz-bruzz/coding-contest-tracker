import express,{Request,Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
type returnFormat = {
    data:any,
    ok:boolean
}
export async function getAtcoderData(){
    try{
        let returnArr:any[] = []
        const response = await axios.get("https://atcoder.jp/contests",{
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        })
        const htmlData = response.data
        const upcomingTable = htmlData.split('id="contest-table-upcoming"')[1];
        if(upcomingTable){
            const tbody = upcomingTable.split('<tbody>')[1].split('</tbody>')[0];
            const rows = tbody.split('<tr');
            rows.forEach((row:string) => {
                if(!row.trim()) return;
                const titleMatch = row.match(/<a href="(\/contests\/[^"]+)">([^<]+)<\/a>/);
                const timeMatch = row.match(/>(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\+0900)</);
                if(titleMatch && timeMatch){
                    let title = titleMatch[2];
                    const timeStr = timeMatch[1];
                    const cleanTime = timeStr.replace(' ', 'T').replace('+0900', '+09:00');
                    const startTime = new Date(cleanTime).getTime() / 1000;
                    if (title.toLowerCase().includes('job') || title.toLowerCase().includes('forecast')) return;
                    title = title.replace(/&amp;/g, '&');
                    returnArr.push({
                        start_epoch_second: startTime,
                        duration_second: 6000, // Default 100min fallback
                        title: title,
                    });
                }
            })
        }
        return [returnArr,true]
    }catch(e){
        return [[],false]
    }
}
dotenv.config()
const router = express.Router()
router.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))
router.use(express.json())
router.get('/',async(req:Request,res:Response<returnFormat>)=>{
    const response = await getAtcoderData()
        if(response[1] === false){
            return res.json({data:[],ok:false})
        }
        return res.json({data:response[0],ok:true})
})
export default router