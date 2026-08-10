import express,{Request,Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
type returnFormat = {
    data:any[],
    ok:boolean
}
export async function getCodeforcesData(){
    try {
        const response = await axios.get('https://codeforces.com/api/contest.list?gym=false')
        const arr = response.data.result.filter((c:any)=>{
            if(c.phase !== 'FINISHED'){
                return true
            }
        })
        return [arr,true]
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
    const response = await getCodeforcesData()
    if(response[1] === false){
        return res.json({data:[],ok:false})
    }
    return res.json({data:response[0],ok:true})
})
export default router