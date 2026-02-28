import { mount } from 'svelte'
import App from './App.svelte'
import './styles/global.css'
import { inject } from '@vercel/analytics'

const app = mount(App, { target: document.getElementById('app') })

// Inject Vercel Analytics
inject()

export default app
