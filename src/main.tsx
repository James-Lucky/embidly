import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Hero from './components/landing/Hero'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Hero />
  </StrictMode>,
)
