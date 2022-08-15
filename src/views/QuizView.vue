<script setup>
import { onMounted, computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import IconSquare from "@/components/Icons/IconSquare.vue";
import IconZ from "@/components/Icons/IconZ.vue";
import IconStar from "@/components/Icons/IconStar.vue";
import IconTriangle from "@/components/Icons/IconTriangle.vue";
import IconN from "@/components/Icons/IconN.vue";

import quizObject from "@/utils/questions";
// import { smallQuiz } from "@/utils/questions";

const icons = {
  I: IconSquare,
  D: IconZ,
  C: IconStar,
  S: IconTriangle,
  N: IconN,
};

const state = reactive({
  quiz: quizObject,
  questionIndex: 0,
  userResponses: {},
  isFinished: false,
});

const store = useStore();
const router = useRouter();

const user = computed(() => store.state.user);
const currentQuestionObject = computed(
  () => state.quiz.questions[state.questionIndex]
);

const userResponsesArray = computed(() => Object.values(state.userResponses));
const testFinished = computed(
  () => state.quiz.questions.length === userResponsesArray.value.length
);
const currentStepResponseObj = computed(
  () => state.userResponses[state.questionIndex]
);
const nextStepDisabled = computed(() => {
  if (!currentStepResponseObj.value) {
    return true;
  }
  if (Object.keys(currentStepResponseObj.value).length < 2) return true;
  return false;
});

const checkDisableOption = (optionIndex, incomeKey) => {
  for (const key in currentStepResponseObj.value) {
    const element = currentStepResponseObj.value[key];
    if (key !== incomeKey && optionIndex === element.index) return true;
  }

  return false;
};

const selectOption = (obj) => {
  const { index, varriant, key } = obj;
  const stepObject = {
    type: varriant.type,
    index,
  };

  state.userResponses[state.questionIndex] = {
    ...state.userResponses[state.questionIndex],
    [key]: stepObject,
  };
};

const calculateOptions = computed(() => {
  const initialState = {
    more: {
      D: 0,
      I: 0,
      S: 0,
      C: 0,
      N: 0,
    },
    less: {
      D: 0,
      I: 0,
      S: 0,
      C: 0,
      N: 0,
    },
  };
  const answersObject = userResponsesArray.value.reduce((acc, item) => {
    for (const key in item) {
      const type = item[key].type;
      acc[key] = {
        ...acc[key],
        [type]: acc[key][type] + 1,
      };
    }
    return acc;
  }, initialState);

  return answersObject;
});

// eslint-disable-next-line
const calculateFinal = computed(() => {
  const { more, less } = calculateOptions.value;

  const maxProp = {
    type: null,
    value: 0,
  };

  for (const prop in more) {
    const difference = more[prop] - less[prop];

    if (!maxProp.type) {
      maxProp.type = prop;
      maxProp.value = difference;
    } else if (difference > maxProp.value) {
      maxProp.type = prop;
      maxProp.value = difference;
    }
  }

  return maxProp;
});

const prev = () => {
  state.questionIndex -= 1;
};

const next = () => {
  state.questionIndex += 1;
  if (testFinished.value) {
    state.isFinished = true;
    store.dispatch("getConfiguratorId", calculateFinal.value);
  }
};

const finishQuiz = () => {
  store.dispatch("sendConfig");

  setTimeout(() => {
    router.push("/");
  }, 2000);
};

onMounted(() => {
  if (!user.value) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }
});
</script>
<template>
  <div
    class="quiz h-screen p-5 flex flex-col md:justify-center md:items-center"
  >
    <p v-if="!user">Пользователь не найден, тест не доступен.</p>
    <div v-else-if="!state.isFinished" class="quiz__wrap">
      <div class="logo flex justify-center mb-10">
        <svg
          width="210"
          height="100%"
          viewBox="0 0 174 21"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.1 20.8C3.5 20.8 0 16.8 0 10.5C0 7.79998 0.800005 5.19997 2.2 3.39997C3.9 1.29997 6.3 0.0999756 9.2 0.0999756C11.1 0.0999756 13 0.699974 14.5 1.69997C16.2 2.89997 17.2 4.59997 17.4 6.69997L17.5 7.39998H13.9L13.8 6.89998C13.4 4.79998 11.7 3.59998 9.3 3.59998C5.3 3.59998 3.9 7.19998 3.9 10.5C3.9 14.8 6 17.4 9.3 17.4C12 17.4 13.7 15.8 14 12.7L14.1 12.1H17.8L17.7 12.8C17.2 17.7 14 20.8 9.1 20.8Z"
          />
          <path
            d="M21.4 0.0999756V20.7H35.8V17.2H25.2V11.8H35.1V8.29997H25.2V3.69997H35.8V0.0999756H21.4Z"
          />
          <path
            d="M52.7 0.0999756V14.1L43.7 0.0999756H40V20.7H43.8V6.89998L52.6 20.7H56.4V0.0999756H52.7Z"
          />
          <path
            d="M59.9 0.0999756V3.69997H66.2V20.7H70V3.69997H76.3V0.0999756H59.9Z"
          />
          <path
            d="M107.7 20.8C105.2 20.8 103.1 20.1 101.7 18.9C100.3 17.6 99.5 15.8 99.5 13.6V12.9H103.2V13.6C103.3 16.2 104.8 17.5 108 17.5C111.5 17.5 111.9 15.6 111.9 14.8C111.9 13.1 110.4 12.6 107.4 11.9L106.4 11.7C103.6 11.1 100.2 10.3 100.2 6.10001C100.2 4.10001 101 2.50002 102.6 1.50002C103.9 0.600015 105.6 0.200012 107.4 0.200012C112 0.200012 114.6 2.50001 114.7 6.70001V7.40002H111.1L111 6.80001C110.8 4.60001 109.6 3.60001 107.1 3.60001C105.5 3.60001 103.6 4.00002 103.6 6.00002C103.6 7.40002 104.8 7.80002 107.9 8.50002H108H108.2C110.9 9.10002 115.3 10.1 115.3 14.6C115.3 16.3 114.8 17.7 113.7 18.8C113.1 19.4 111.2 20.8 107.7 20.8Z"
          />
          <path
            d="M131.3 0.0999756L126.3 15.4L121.4 0.0999756H117.2L124.4 20.7H128.2L135.3 0.0999756H131.3Z"
          />
          <path
            d="M139.1 0.0999756V20.7H153.5V17.2H142.9V11.8H152.8V8.29997H142.9V3.69997H153.5V0.0999756H139.1Z"
          />
          <path
            d="M157 0.0999756V3.69997H163.3V20.7H167.2V3.69997H173.5V0.0999756H157Z"
          />
          <path
            d="M87.6 9H83.6V3.6H88.3C90.2 3.6 91.9 3.9 91.9 6.3C91.9 8.8 90 9 87.6 9ZM93 11.1C93.2 11 93.2 11 93.3 10.9C94.9 9.9 95.9 8.1 95.9 6C95.9 2 93.5 0 88.9 0H79.9V20.6H83.7V12.2H88C88.4 12.2 88.9 12.2 89.3 12.1L92.2 20.5H96.3L93 11.1Z"
          />
        </svg>
      </div>
      <h1 class="mb-8 text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
        Personal Profile Appraisal
      </h1>
      <div class="max-w-4xl mx-auto">
        <p class="mb-4 text-left">
          Пожалуйста, в каждом блоке из 4-х прилагательных выберите 1
          прилагательное, которое <b>наиБОЛЕЕ</b> полно характеризует Вас. Выбор
          варианта ответа, осуществляется нажатием на фигуру напротив
          прилагательного в колонке - <b>БОЛЕЕ</b>.
        </p>
        <p class="mb-10 text-left">
          Пожалуйста, в каждом блоке из 4-х прилагательных выберите 1
          прилагательное, которое <b>наиМЕНЕЕ</b> полно характеризует Вас. Выбор
          варианта ответа, осуществляется нажатием на фигуру напротив
          прилагательного в колонке - <b>МЕНЕЕ</b>.
        </p>
      </div>

      <!--qusetionContainer-->
      <div
        class="questionContainer max-w-4xl mx-auto md:p-10 md:my-5 mb-6 bg-gray-50"
        v-if="state.questionIndex < state.quiz.questions.length"
      >
        <header class="mb-6 py-4">
          <div class="progressContainer">
            <progress
              class="progress is-info is-small"
              :value="(state.questionIndex / state.quiz.questions.length) * 100"
              max="100"
            >
              {{ (state.questionIndex / state.quiz.questions.length) * 100 }}%
            </progress>
            <p>
              {{
                Math.floor(
                  (state.questionIndex / state.quiz.questions.length) * 100
                )
              }}% пройдено
            </p>
          </div>
        </header>

        <!-- quizOptions -->
        <div class="optionContainer mt-4 space-y-4">
          <table class="options-table table-fixed w-full">
            <thead>
              <tr>
                <th class="w-1/2 px-4 py-2">
                  {{ currentQuestionObject.title }}
                </th>
                <th class="w-1/4 px-4 py-2">БОЛЕЕ</th>
                <th class="w-1/4 px-4 py-2">МЕНЕЕ</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(response, index) in currentQuestionObject.responses"
                :key="index"
              >
                <td class="border px-4 py-2">
                  {{ response.text }}
                </td>
                <td
                  class="border px-4 py-2"
                  :class="{ active: false }"
                  :key="key"
                  v-for="(varriant, key) in response.varriants"
                >
                  <div class="option flex items-center justify-center py-3">
                    <input
                      type="radio"
                      :name="'step-' + state.questionIndex + key"
                      :id="key + state.questionIndex + index"
                      class="focus:ring-gray-500 h-4 w-4 text-gray-600 border-gray-300 opacity-0"
                      :value="key + state.questionIndex + index"
                      :key="key + state.questionIndex + index"
                      @change="selectOption({ varriant, index, key })"
                      :disabled="checkDisableOption(index, key)"
                    />
                    <label
                      :for="key + state.questionIndex + index"
                      class="flex items-center justify-center text-md font-medium text-gray-700"
                    >
                      <component
                        :is="icons[varriant.type]"
                        class="icon"
                      ></component>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--quizFooter: navigation and progress-->
        <footer class="questionFooter mt-6">
          <!--pagination-->
          <nav class="pagination" role="navigation" aria-label="pagination">
            <!-- back button -->
            <button
              style="display: none"
              class="button"
              type="button"
              @click="prev()"
              :disabled="state.questionIndex < 1"
            >
              Назад
            </button>

            <!-- next button -->
            <div class="px-4 py-3 text-right sm:px-6">
              <button
                type="button"
                @click="next()"
                :disabled="nextStepDisabled"
                class="next-btn inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Далее
              </button>
            </div>
          </nav>
          <!--/pagination-->
        </footer>
        <!--/quizFooter-->
      </div>
    </div>

    <div class="max-w-4xl mx-auto p-10 my-5 bg-gray-50" v-if="state.isFinished">
      <h2 class="my-10 text-xl">Тестирование пройдено, ваши результаты:</h2>
      <table class="options-table table-fixed w-full">
        <thead>
          <tr>
            <th class="w-1/4 px-4 py-2">ПОКАЗАТЕЛЬ</th>
            <th class="w-1/4 px-4 py-2">БОЛЕЕ</th>
            <th class="w-1/4 px-4 py-2">МЕНЕЕ</th>
            <th class="w-1/4 px-4 py-2">РАЗНИЦА</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border px-4 py-2">D</td>
            <td class="border px-4 py-2">{{ calculateOptions.more.D }}</td>
            <td class="border px-4 py-2">{{ calculateOptions.less.D }}</td>
            <td class="border px-4 py-2">
              {{ calculateOptions.more.D - calculateOptions.less.D }}
            </td>
          </tr>
          <tr>
            <td class="border px-4 py-2">I</td>
            <td class="border px-4 py-2">{{ calculateOptions.more.I }}</td>
            <td class="border px-4 py-2">{{ calculateOptions.less.I }}</td>
            <td class="border px-4 py-2">
              {{ calculateOptions.more.I - calculateOptions.less.I }}
            </td>
          </tr>
          <tr>
            <td class="border px-4 py-2">S</td>
            <td class="border px-4 py-2">{{ calculateOptions.more.S }}</td>
            <td class="border px-4 py-2">{{ calculateOptions.less.S }}</td>
            <td class="border px-4 py-2">
              {{ calculateOptions.more.S - calculateOptions.less.S }}
            </td>
          </tr>
          <tr>
            <td class="border px-4 py-2">C</td>
            <td class="border px-4 py-2">{{ calculateOptions.more.C }}</td>
            <td class="border px-4 py-2">{{ calculateOptions.less.C }}</td>
            <td class="border px-4 py-2">
              {{ calculateOptions.more.C - calculateOptions.less.C }}
            </td>
          </tr>
          <tr>
            <td class="border px-4 py-2">N</td>
            <td class="border px-4 py-2">{{ calculateOptions.more.N }}</td>
            <td class="border px-4 py-2">{{ calculateOptions.less.N }}</td>
            <td class="border px-4 py-2">
              {{ calculateOptions.more.N - calculateOptions.less.N }}
            </td>
          </tr>
        </tbody>
      </table>
      <p class="mt-5">
        Наибольший показатель разницы:
        <b>{{ calculateFinal.type }} - {{ calculateFinal.value }}</b>
      </p>
      <div class="px-4 py-3 text-center sm:px-6">
        <button
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          type="button"
          @click="finishQuiz"
        >
          Отправить результаты
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$trans_duration: 0.3s;
$primary_color: #222;

.button {
  transition: $trans_duration;
}

.next-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.progressContainer {
  width: 60%;
  margin: 0 auto;

  > progress {
    display: block;
    width: 100%;
    margin: 0;
    border-radius: 5rem;
    overflow: hidden;
    border: none;

    color: $primary_color;
    background-color: #d6d6d6;

    &::-moz-progress-bar {
      background-color: $primary_color;
    }

    &::-webkit-progress-value {
      background-color: $primary_color;
    }
  }

  > p {
    margin: 0;
    margin-top: 0.5rem;
  }
}

.options-table {
  > td.active {
    @apply bg-gray-400;
  }
  td {
    position: relative;
    .option {
      label {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        top: 0;
      }

      input:checked + label {
        @apply bg-gray-400;
      }
      input:disabled + label {
        @apply opacity-50 cursor-not-allowed;
      }
    }
  }
}
</style>
