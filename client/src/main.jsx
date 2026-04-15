import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ThemeProvider>
    <AppProvider> 
      <App />
    </AppProvider>
  </ThemeProvider>
  </BrowserRouter>,
)
