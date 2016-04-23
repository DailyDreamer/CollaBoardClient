import fabric from 'fabric'
import Helper from './Helper.js'


function canvasEvents(canvas, socket) {

  canvas.on('object:added', (e) => {
    let fabricObject = e.target;
    if(!fabricObject.remote) {
      fabricObject.setOptions({uuid: Helper.genUUID()});
      socket.emit('object:added', Helper.genJSONString(fabricObject));
    }
    delete fabricObject.remote;
  });

  socket.on('object:added', (msg) => {
    //bring object back to fabricObject
    let rawObject = JSON.parse(msg);
    fabric.util.enlivenObjects([rawObject], (fabricObjects) => {
      for(let fabricObject of fabricObjects) {
          fabricObject.remote = true;
          fabricObject.setOptions({uuid: rawObject.uuid});
          canvas.add(fabricObject);
      };
    });
  });

  canvas.on('object:removed', (e) => {
    let fabricObject = e.target;
    if (!fabricObject.remote) {
      socket.emit('object:removed', Helper.genJSONString(fabricObject));
    };
    delete fabricObject.remote;
  });

  socket.on('object:removed', (msg) => {
    let rawObject = JSON.parse(msg);
    canvas.remove(Helper.getObjectByUUID(canvas, rawObject.uuid));
  });

  canvas.on('object:moving', (e) => {
    let fabricObject = e.target;
    socket.emit('object:modified', Helper.genJSONString(fabricObject));
  });
  canvas.on('object:scaling', (e) => {
    let fabricObject = e.target;
    socket.emit('object:modified', Helper.genJSONString(fabricObject));
  });
  canvas.on('object:rotating', (e) => {
    let fabricObject = e.target;
    socket.emit('object:modified', Helper.genJSONString(fabricObject));
  });

  socket.on('object:modified', (msg) => {
    let rawObject = JSON.parse(msg);
    if(rawObject.type === 'note' || rawObject.type === 'group') {
      delete rawObject.fill
      delete rawObject.stroke
    }
    let fabricObject = Helper.getObjectByUUID(canvas, rawObject.uuid);
    if (fabricObject) {
      fabricObject.set(rawObject)
      canvas.renderAll();
    } else {
      console.log('No object found');
    }
  });
}

export default canvasEvents;
