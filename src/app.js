import Vue from 'vue';
import App from './client/App';
import { createRouter } from './client/router';
import { createStore } from './client/store';
import { sync } from 'vuex-router-sync';

Vue.config.productionTip = false;

export function createApp() {
  const router = createRouter();
  const store = createStore();

  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App),
    mounted() {
      document.dispatchEvent(new Event('render-event'))
    }
  });

  return {
    app,
    router,
    store
  };
}
