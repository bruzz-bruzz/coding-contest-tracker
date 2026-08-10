let a = Date.now()
let b = Date.parse("2026-08-15T14:30:00.000Z")
const s = Math.floor((b - a) / 1000)
const second = s % 60
const m = Math.floor(s / 60) % 60
const h = Math.floor(s / 3600) % 60
const d = Math.floor(s / (3600 * 24)) % 24 
console.log(d,h,m,second,s)