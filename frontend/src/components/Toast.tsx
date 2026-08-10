import './App.css'
type Data = {
    msg:string,
    ok:boolean
}
export default function Toast({msg,ok}:Data){
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={`${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-4 py-2 rounded-md mb-4 text-center font-mono shadow-md transition-opacity duration-300`}>
                {msg}
            </div>  
        </div>
    )
}