import fabric from 'fabric'
import Helper from './Helper.js'


function canvasEvents(canvas, socket) {
  canvas.on('object:added', function(e) {
    let fabricObject = e.target;
    if(!fabricObject.remote) {
      fabricObject.setOptions({uuid: Helper.genUUID()});
      socket.emit('object:added', Helper.genJSONString(fabricObject));
    }
    delete fabricObject.remote;
  });

  socket.on('object:added', function(msg) {
    //bring object back to fabricObject
    let rawObject = JSON.parse(msg);
    fabric.util.enlivenObjects([rawObject], function(fabricObjects) {
      console.log(fabricObjects);
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

  socket.on('note:added', function(msg) {
    let note = JSON.parse(msg);
    fabric.util.enlivenObjects(note.objects, function(fabricObjects) {
      console.log(fabricObjects);
      for (let fabricObject of fabricObjects) {
        fabricObject.hasBorders = false;
      }
      let group = new fabric.Group(fabricObjects, {
        left: 0,
        top: 0,
      });
      let back = new fabric.Rect({
        left: group.left,
        top: group.top,
        fill: 'yellow',
        width: group.width,
        height: group.height,
      });
      group.addWithUpdate(back);
      back.sendToBack();
      group.type = 'note';
      group.remote = true;
      console.log(note.uuid);
      group.setOptions({uuid: note.uuid});
      canvas.add(group);
    });
  });

  canvas.on('object:moving', (e) => {
    if(e.target.type === 'group') {
      //todo add support for group modified
    /*  let fabricObjects = e.target;
      for (let fabricObject of fabricObjects.objects) {
        socket.emit('object:modified', JSON.stringify({
          top: fabricObject.top + fabricObjects.top,
          left: fabricObject.left + fabricObjects.left,
          uuid: fabricObject.uuid,
        }));
      }*/
    } else {
      let fabricObject = e.target;
      socket.emit('object:modified', Helper.genJSONString(fabricObject));
    }
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
