import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { globalCookiesConfig } from 'vue3-cookies'
import store from './store'

globalCookiesConfig({
    expireTimes: "7d",
    path: "/",
    domain: "",
    secure: true,
    sameSite: "None",
  });

createApp(App).use(store).mount('#app')
