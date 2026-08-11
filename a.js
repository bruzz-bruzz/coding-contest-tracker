async function a(){
    const res = await fetch("https://coding-contest-tracker-aa3b.vercel.app/all")
    const data = await res.json()
    console.log(data)
}a()