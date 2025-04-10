import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// PrimeVue
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config'

// Vue Router
import { createRouter, createWebHistory } from 'vue-router'
import routes from './router/index.ts' // Assure-toi que ce fichier existe et exporte un tableau de routes

// Vue-ECharts
import VueECharts from 'vue-echarts'
import { use } from 'echarts/core'
import {
    CanvasRenderer
} from 'echarts/renderers'
import {
    BarChart,
    LineChart,
    PieChart
} from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components'

// Enregistrer les composants ECharts nécessaires
use([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
])

const app = createApp(App)

// Ajout de PrimeVue
app.use(PrimeVue)

// Ajout du router
const router = createRouter({
    history: createWebHistory(),
    routes
})
app.use(router)

// Ajout de ECharts en tant que composant global
app.component('v-chart', VueECharts)

app.mount('#app')
