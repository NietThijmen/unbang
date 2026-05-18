import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { injectSpeedInsights } from '@vercel/speed-insights'

const app = mount(App, {
  target: document.getElementById('app')!,
})

// Initialize Vercel Speed Insights
injectSpeedInsights()

export default app
