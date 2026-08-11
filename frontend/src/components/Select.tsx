import { useEffect, useRef, useState } from 'react'

type Props = {
  options: string[]
  value: string
  onChange: (v: string) => void
  className?: string
}

export default function Select({ options, value, onChange, className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <div ref={ref} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-between w-44 px-3 py-2 rounded-md bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-sky-300"
      >
        <span className="truncate">{value}</span>
        <svg className={`ml-3 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="absolute mt-2 w-44 z-50 bg-white/5 backdrop-blur rounded-md shadow-lg py-1 max-h-60 overflow-auto">
          {options.map((opt) => (
            <li key={opt}>
              <button
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm ${opt === value ? 'bg-sky-600/60 text-white' : 'text-slate-100 hover:bg-sky-600/30'}`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
