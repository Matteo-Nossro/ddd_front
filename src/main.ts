import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// ✅ PrimeVue
// import "primevue/resources/themes/lara-light-blue/theme.css"; // Choisis le thème que tu veux ici
// import "primevue/resources/themes/lara-common.css";
import "primeicons/primeicons.css";

import Aura from '@primevue/themes/aura';
import PrimeVue from "primevue/config";
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
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'white',
      cssLayer: false
    }
  },
  ripple: true,
  locale: {
    dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    monthNamesShort: ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'],
    today: "Aujourd'hui",
    clear: 'Effacer',
    dateFormat: 'yy-mm-dd',
    firstDayOfWeek: 1,
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
