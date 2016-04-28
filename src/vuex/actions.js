export const socketInit = ({ dispatch }, rid) => dispatch('SOCKET_INIT', rid)

export const socketListen = ({ dispatch, state }) => {
  state.socket.on('ADD', msg => {
    let note = JSON.parse(msg);
    dispatch('ADD', note);
  });
  state.socket.on('STYLE_CHANGE', msg => {
    let style = JSON.parse(msg);
    dispatch('STYLE_CHANGE', style);
  });
  state.socket.on('CONTENT_CHANGE', msg => {
    let content = JSON.parse(msg);
    dispatch('CONTENT_CHANGE', content);
  });
  state.socket.on('ADD_LINK', msg => {
    let link = JSON.parse(msg);
    dispatch('ADD_LINK', link);
  });
}

export const notesInit = ({ dispatch }) => {
  let notes = {'1':{
    id: '1',
    x: 0,
    y: 0,
    width: 200,
    height: 250,
    scale: 1,
    type: 'text',
    content: 'This is a test',
  }, };
  let links = [];
  dispatch('NOTES_INIT', notes, links);
}
export const notifyAdd = ({ dispatch, state }, note) => {
  state.socket.emit('ADD', JSON.stringify(note));
  dispatch('ADD', note);
}
export const notifyStyleChange = ({ dispatch, state }, style) => {
  state.socket.emit('STYLE_CHANGE', JSON.stringify(style));
  dispatch('STYLE_CHANGE', style);
}
export const notifyContentChange = ({ dispatch, state }, content) => {
  state.socket.emit('CONTENT_CHANGE', JSON.stringify(content));
  dispatch('CONTENT_CHANGE', content);
}

export const setSource = ({ dispatch }, source) => dispatch('SET_SOURCE', source)
export const notifyAddLink = ({ dispatch, state }, target) => {
  let link = { source: state.source, target: target };
  state.socket.emit('ADD_LINK', JSON.stringify(link));
  dispatch('ADD_LINK', link);
  dispatch('CLEAR_SOURCE');
}
