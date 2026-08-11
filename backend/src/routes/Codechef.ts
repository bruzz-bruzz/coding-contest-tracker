import express,{Request,Response} from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
type returnFormat = {
    data:any,
    ok:boolean
}
export async function getCodechefData(){
    try{
            const response = await axios.get(`https://www.codechef.com/api/list/contests/all`, {
                params: {
                  sort_by: "START",
                  sorting_order: "asc",
                  offset: 0,
                  mode: "all",
                },
                headers: {
                  // Standard headers to look like a browser if needed
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                  Accept: "application/json",
                },
              });
              const present = response.data.present_contests || [];
              const future = response.data.future_contests || [];
              return [[...present,...future],true]
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
    const response = await getCodechefData()
        if(response[1] === false){
            return res.json({data:[],ok:false})
        }
        return res.json({data:response[0],ok:true})
})
export default router