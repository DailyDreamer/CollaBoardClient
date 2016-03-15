import Vue from 'vue'
import Router from 'vue-router'

import App from './components/App.vue'
import LoginView from './components/LoginView.vue'
import SignupView from './components/SignupView.vue'
import MyRoomView from './components/MyRoomView.vue'
import BoardView from './components/BoardView.vue'
import NoteView from './components/NoteView.vue'

// install router
Vue.use(Router)

// routing
var router = new Router()

router.map({
  '/login': {
    component: LoginView
  },
  '/signup': {
    component: SignupView
  },
  '/myrooms/:uid': {
    component: MyRoomView
  },
  '/board/:rid': {
    component: BoardView
  },
  '/note/:rid': {
    component: NoteView
  }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

router.redirect({
  '*': '/login'
})

router.start(App, '#app')
