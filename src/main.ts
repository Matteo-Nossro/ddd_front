import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// ✅ PrimeVue
import 'primeicons/primeicons.css';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

// ✅ Vue Router
import { createRouter, createWebHistory } from "vue-router";
import routes from "./router/index.ts";

// ✅ Vue-ECharts
import VueECharts from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";

// ECharts config
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

// ✅ Création de l'app Vue
const app = createApp(App);

// ✅ Config PrimeVue avec locale française (optionnel mais recommandé)
app.use(PrimeVue, {
  // Default theme configuration
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'white',
      cssLayer: false
    }
  }
});

// ✅ Ajout du router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);
app.use(ToastService);
// ✅ Ajout de composants globaux
app.component("v-chart", VueECharts);

app.component("Toast", Toast);

// ✅ Mount
app.mount("#app");
