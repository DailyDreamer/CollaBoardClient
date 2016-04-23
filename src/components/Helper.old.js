class Helper {
  constructor(){}

  static genJSONString(fabricObject) {
    return JSON.stringify(fabricObject.toJSON(['uuid']));
  }

  static genUUID() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    });
  }

  static getObjectByUUID(canvas, UUID) {
    let objects = canvas.getObjects();
    for (let fabricObject of objects) {
      if (fabricObject.uuid === UUID) {
        return fabricObject;
      }
    }
  }
}

export default Helper
