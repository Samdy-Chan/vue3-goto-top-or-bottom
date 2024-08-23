import { createApp } from 'vue';
// import './style.css'
import App from './App.vue';

// 1、import the @samdy-chan/vue3-goto-top-or-bottom component (must use default import method).
// Before use, please execute the command "npm install" to install this component.
// import GotoTopOrBottom from '@samdy-chan/vue3-goto-top-or-bottom';

const app = createApp(App);

// 2、Global registration of @samdy-chan/vue3-goto-top-or-bottom component.
// app.use(GotoTopOrBottom);

app.mount('#app');
