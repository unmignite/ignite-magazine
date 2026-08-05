import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import '@fontsource/league-spartan/400.css'
import '@fontsource/league-spartan/600.css'
import '@fontsource/league-spartan/700.css'
import '@fontsource/league-spartan/800.css'
import '@fontsource/league-spartan/900.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/400-italic.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'

import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
