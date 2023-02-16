import { createApp } from 'vue'
import App from './App.vue'
import widgets from 'cesium/Widgets/widgets.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// const widgets = require('cesium/Widgets/widgets.css')
const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
