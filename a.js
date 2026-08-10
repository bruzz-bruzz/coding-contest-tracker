let a = new Date()
let b = new Date(Date.parse("2026-08-12T20:00:00+05:30"))
const s = Math.floor((b - a) / 1000)
const second = s % 60
const m = Math.floor(s / 60) % 60
const h = Math.floor(s / 3600) % 60
const d = Math.floor(s / (3600 * 24)) % 24 
console.log(d,h,m,second,s)