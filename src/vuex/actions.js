export const socketInit = ({ dispatch }, rid) => dispatch('SOCKET_INIT', rid)

export const socketListen = ({ dispatch, state }) => {
  state.socket.on('note:added', msg => {
    let note = JSON.parse(msg);
    dispatch('ADD', note);
  });
  state.socket.on('note:style', msg => {
    let style = JSON.parse(msg);
    dispatch('STYLE_CHANGE', style);
  });
}

export const notesInit = ({ dispatch }) => {
  let notes = {'1':{
    id: '1',
    x: 0,
    y: 0,
    width: 200,
    height: 250,
    type: 'text',
    content: 'This is a test',
  }, };
  dispatch('NOTES_INIT', notes);
}
export const notifyAdd = ({ dispatch, state }, note) => {
  state.socket.emit('note:added', JSON.stringify(note));
  dispatch('ADD', note);
}
export const notifyStyleChange = ({ dispatch, state }, style) => {
  state.socket.emit('note:style', JSON.stringify(style));
  dispatch('STYLE_CHANGE', style);
}
export const notifyContentChange = ({ dispatch }, content) => dispatch('CONTENT_CHANGE', content)
