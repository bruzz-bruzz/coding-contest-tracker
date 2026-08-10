const axios = require("axios")
async function a(){
    const BASE_URL = 'https://codeforces.com/api';
    const res = await axios.get('https://codeforces.com/api/contest.list?gym=false')
    const arr = res.data.result.filter((c)=>{
        if(c.phase !== 'FINISHED'){
            console.log(new Date(c.startTimeSeconds * 1000))
            return true
        }
    })
    console.log(arr)
}
a()