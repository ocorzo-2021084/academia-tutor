import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "./store/user";
import { userDatabaseStore } from "./store/database";

import DashBoard from "./pages/Dashboard/DashBoard.vue";
import Login from "./pages/Login/LoginView.vue";
import ProfileView from "./pages/Profile/ProfileView.vue";
import NotesView from "./pages/Notes/NotesView.vue";
import ChatBotView from "./pages/Bot/ChatBotView.vue";
import RegisterView from "./pages/Register/RegisterView.vue";
import QuizPage from "./pages/Quiz/QuizPage.vue";
import TutorPage from "./pages/Tutor/TutorPage.vue";

const requireAuth = async (to, from, next) => {
  const userStore = useUserStore();
  if (!userStore.userData && !userStore.loadingSession) {
    const user = await userStore.currentUser();
    if (user) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
};

const redireccion = async (to, from, next) => {
  const databaseStore = userDatabaseStore();
  const userStore = useUserStore();
  userStore.loadingSession = true;
  console.log(to.params.pathMatch[0]);
  const name = await databaseStore.getUrl(to.params.pathMatch[0]);
  if (!name) {
    next();
    userStore.loadingSession = false;
  } else {
    window.location.href = name;
    userStore.loadingSession = true;
    next();
  }
};

const routes = [
  {
    path: "/",
    component: DashBoard,
    name: "dashboard",
    beforeEnter: requireAuth,
  },
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: RegisterView, name: "register" },
  {
    path: "/profile",
    component: ProfileView,
    name: "profile",
    beforeEnter: requireAuth,
  },
  {
    path: "/notes",
    component: NotesView,
    name: "notes",
    beforeEnter: requireAuth,
  },
  {
    path: "/assistant",
    component: ChatBotView,
    name: "assistant",
    beforeEnter: requireAuth,
  },
  {
    path: "/quiz",
    component: QuizPage,
    name: "quiz",
    beforeEnter: requireAuth,
  },
  {
    path: "/tutor",
    component: TutorPage,
    props: (route) => ({ incorrectQuestions: route.params.incorrectQuestions }),
    name: "tutor",
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
