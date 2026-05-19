import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import Redirecting from './Pages/Redirecting.svelte';

import {handleRedirect} from "./lib/navigate";


handleRedirect();

const hasQueryParam = new URL(window.location.href).searchParams.has('q');
let app: any;

if(hasQueryParam) {
  app = mount(Redirecting, {
    target: document.getElementById('app')!,
  })
} else {
  app = mount(App, {
    target: document.getElementById('app')!,
  })
}



export default app
