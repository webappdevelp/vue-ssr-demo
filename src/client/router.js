import Vue from 'vue';
import Router from 'vue-router';
const Home = () => import('./view/Home.vue');
const About = () => import('./view/About.vue');

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/about',
        name: 'about',
        component: About
      }
    ]
  })
}