import './assets/main.css';
import 'primeicons/primeicons.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import router from './router';

import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import Vue3TouchEvents from 'vue3-touch-events';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css';


const vuetify = createVuetify({
    components,
    directives,
  })

const pinia = createPinia()
const app = createApp(App);

app.use(router);
app.use(Vue3TouchEvents);
app.use(Toast);
app.use(pinia);
app.use(vuetify);
app.mount('#app');
