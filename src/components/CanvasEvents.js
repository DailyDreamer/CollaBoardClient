import fabric from 'fabric'

class CanvasEvents {
  constructor(canvas, socket, rid) {
    socket.emit('join', rid);

    canvas.on('object:added', function(e) {
      var fabricObject = e.target;
      console.log('object:added');
      console.log(fabricObject);
      if(!fabricObject.remote) {
        socket.emit('object:added', JSON.stringify(fabricObject));
      }
      delete fabricObject.remote;
    });

    socket.on('object:added', function(msg) {
      //bring object back to fabricObject
      fabric.util.enlivenObjects([JSON.parse(msg)], function(fabricObjects) {
        console.log(fabricObjects);
        fabricObjects.forEach(function(fabricObject) {
            fabricObject.remote = true
            canvas.add(fabricObject)
        });
      });
    });
    
    socket.on('note:added', function(msg) {
      var note = JSON.parse(msg);
      fabric.util.enlivenObjects(note.objects, function(fabricObjects) {
        console.log(fabricObjects);
        var group = new fabric.Group(fabricObjects, {
          left: 0,
          top: 0,
        });
        var back = new fabric.Rect({
          left: group.left,
          top: group.top,
          fill: 'yellow',
          width: group.width,
          height: group.height,
        });
        group.addWithUpdate(back);
        back.sendToBack();
        group.remote = true;

        canvas.add(group);
      });
    });
  }
}

export default CanvasEvents;
