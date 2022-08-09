import { createStore } from "vuex";

import { saveConfigurator, sendEmailConfig } from "@/api/configurator";
import { TARGET_EMAIL } from "@/utils/constans";

export default createStore({
  state: {
    user: "",
    configuratorID: null,
    finalResult: null,
  },
  getters: {},
  mutations: {
    UPDATE_USER(state, newUser) {
      state.user = newUser;
    },
    UPDATE_CONFIG_ID(state, id) {
      state.configuratorID = id;
    },
    UPDATE_FINAL_RESULT(state, obj) {
      state.finalResult = obj;
    },
  },
  actions: {
    addUser({ commit }, payload) {
      commit("UPDATE_USER", payload);
    },
    async getConfiguratorId({ commit }, payload) {
      const response = await saveConfigurator(payload);
      const { config_key } = response;

      commit("UPDATE_CONFIG_ID", config_key);
      commit("UPDATE_FINAL_RESULT", payload);
    },
    async sendConfig({ state }) {
      const finalObject = {
        user: state.user,
        result: state.finalResult,
      };
      sendEmailConfig(TARGET_EMAIL, state.configuratorID, finalObject);
    },
  },
});
