<script setup>
import { reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const state = reactive({
  fio: "",
});

const store = useStore();

const router = useRouter();

const handleFormSubmit = () => {
  if (!state.fio) {
    return;
  }

  store.dispatch("addUser", state.fio);
  router.push("/quiz");
};
</script>
<template>
  <div class="login h-screen px-5 flex flex-col justify-center items-center">
    <h1 class="mb-8 text-xl md:text-2xl font-bold">
      Введите ФИО, чтобы начать тестирование.
    </h1>
    <form @submit.prevent="handleFormSubmit" class="w-full max-w-sm">
      <div class="flex items-center border-b border-gray-500 py-2">
        <input
          v-model="state.fio"
          class="without-ring appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-4 px-2 leading-tight focus:outline-none shadow-none focus:shadow-none ring-0 ring-gray-500"
          type="text"
          placeholder="ФИО"
          aria-label="ФИО"
        />
        <button
          :disabled="!state.fio"
          @click="handleFormSubmit"
          class="login-btn flex-shrink-0 bg-gray-500 hover:bg-gray-700 border-gray-500 hover:border-gray-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="button"
        >
          Начать тест
        </button>
      </div>
    </form>
  </div>
</template>
<style>
.login-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
.without-ring {
  @apply focus:ring-0 focus:ring-offset-0;
}
</style>
