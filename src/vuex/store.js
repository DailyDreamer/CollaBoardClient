import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
import config from '../config.json'
Vue.use(Vuex)

const state = {
  notes: {},
  links: [],
  socket: null,
  source: null, //for link
}

const mutations = {
  SOCKET_INIT (state, rid) {
    state.socket = io(config.server);
    state.socket.emit('join', rid);
  },

  NOTES_INIT (state, notes, links) {
    state.notes = notes;
    state.links = links;
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

  SET_SOURCE (state, source) {
    if (source) {
      state.notes[source].scale = 1.1;
    } else if (state.source){
      //source = null
      state.notes[state.source].scale = 1;
    }
    state.source = source;
  },

  ADD_LINK (state, link) {
    state.links.push(link);
  },

  CLEAR_SOURCE (state) {
    if (state.source) {
      state.notes[state.source].scale = 1;
      state.source = null;
    }
  },
}

export default new Vuex.Store({
  state,
  mutations
})
