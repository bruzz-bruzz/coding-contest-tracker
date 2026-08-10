import express,{Request,Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
type returnFormat = {
    data:any,
    ok:boolean
}
export async function getLeetCodeData(){
    try{    
        const response = await axios.post(
                'https://leetcode.com/graphql',
                {
                  query: `
                    query {
                        topTwoContests {
                        title
                        titleSlug
                        startTime
                        duration
                        }
                    }
                    `,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
              return [response.data,true]
    }catch(err){
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
    const response = await getLeetCodeData()
    if(response[1] === false){
        return res.json({data:[],ok:false})
    }
    return res.json({data:response[0],ok:true})
})
export default router