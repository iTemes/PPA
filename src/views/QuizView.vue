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

  console.log("answersObject", answersObject);
  return answersObject;
});

// eslint-disable-next-line
const calculateFinal = computed(() => {
  const { more, less } = calculateOptions.value;

  console.log("calcMmoreaxDifference", more);
  console.log("less", less);

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
  console.log("Prev question");
  state.questionIndex -= 1;
};

const next = () => {
  state.questionIndex += 1;
  if (testFinished.value) {
    state.isFinished = true;
    store.dispatch("getConfiguratorId", calculateFinal.value);
  }
};

const finishQuiz = () => {};

onMounted(() => {
  if (!user.value) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }
});
</script>
<template>
  <div class="quiz h-screen flex flex-col justify-center items-center">
    <p v-if="!user">Пользователь не найден, тест не доступен.</p>
    <div v-else-if="!state.isFinished" class="quiz__wrap">
      <h1 class="mb-8 text-3xl font-bold">Personal Profile Appraisal</h1>
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
        class="questionContainer max-w-4xl mx-auto p-10 my-5 bg-gray-50"
        v-if="state.questionIndex < state.quiz.questions.length"
      >
        <header class="mb-10">
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
      <h2 class="my-10 text-xl">Тестирование законченно, ваши результаты:</h2>
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
        <button type="button" @click="finishQuiz">Отправить результаты</button>
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
