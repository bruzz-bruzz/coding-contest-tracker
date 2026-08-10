import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import { CookiesProvider } from 'react-cookie'
createRoot(document.getElementById('root')!).render(
    <CookiesProvider>
      <App/>
    </CookiesProvider>
)
