import { createRoot } from 'react-dom/client'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Discord from './components/Discord.tsx'
import App from './components/App.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
        <Route path='/' element={<App/>}></Route>
        <Route path='/discordBot' element={<Discord/>}></Route>
    </Routes>
  </BrowserRouter>
)
