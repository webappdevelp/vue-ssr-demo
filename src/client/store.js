import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      msg: '哈哈'
    },
    actions: {
      changeMsg({ commit }) {
        commit('editMsg', '真的是')
      }
    },
    mutations: {
      editMsg(state, msg) {
        state.msg = msg;
        // Vue.set(state, 'msg', msg);
      }
    }
  })
}