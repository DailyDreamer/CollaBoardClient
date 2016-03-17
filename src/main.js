import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'

import App from './components/App.vue'
import LoginView from './components/LoginView.vue'
import SignupView from './components/SignupView.vue'
import MyRoomView from './components/MyRoomView.vue'
import BoardView from './components/BoardView.vue'
import NoteView from './components/NoteView.vue'


Vue.use(Router)
Vue.use(Resource)

var router = new Router()

router.map({
  '/login': {
    name: 'login',
    component: LoginView
  },
  '/signup': {
    name: 'signup',
    component: SignupView
  },
  '/myrooms/:uid': {
    name: 'myrooms',
    component: MyRoomView
  },
  '/board/:rid': {
    name: 'board',
    component: BoardView
  },
  '/note/:rid': {
    name: 'note',
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
