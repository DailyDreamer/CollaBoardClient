export const socketInit = ({ dispatch }, rid) => dispatch('SOCKET_INIT', rid)

export const socketListen = (store) => {
  store.state.socket.on('note:added', msg => {
    let note = JSON.parse(msg);
    add(store, note);
  });
  store.state.socket.on('note:style', msg => {
    let style = JSON.parse(msg);
    styleChange(store, style);
  });
}

export const notesInit = ({ dispatch }) => {
  let notes = {'1':{
    id: '1',
    x: 0,
    y: 0,
    width: 200,
    height: 250,
    type: 'text-note',
    content: 'This is a test',
  }, };
  dispatch('NOTES_INIT', notes);
}
export const add = ({ dispatch }, note) => dispatch('ADD', note)
export const styleChange = ({ dispatch, state }, style) => {
  dispatch('STYLE_CHANGE', style);
}
export const notifyStyleChange = ({ dispatch, state }, style) => {
  state.socket.emit('note:style', JSON.stringify(style));
  dispatch('STYLE_CHANGE', style);
}
export const contentChange = ({ dispatch }, content) => dispatch('CONTENT_CHANGE', content)
