import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
import config from '../config.json'
Vue.use(Vuex)

const state = {
  notes : {},
  socket: null,
}

const mutations = {
  SOCKET_INIT (state, rid) {
    state.socket = io(config.server);
    state.socket.emit('join', rid);
  },

  NOTES_INIT (state, notes) {
    state.notes = notes;
  },

  ADD (state, note) {
    //use compute property and object spread here
    state.notes = { ...state.notes,  [note.id]: note };
  },

  STYLE_CHANGE (state, style) {
    let note = state.notes[style.id];
    note.x = style.x;
    note.y = style.y;
  },

  CONTENT_CHANGE (state, content) {
    state.notes[content.id].content = content.content;
  },
}

export default new Vuex.Store({
  state,
  mutations
})
