class Sketch {
  constructor(canvas) {
    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext('2d');

    //add event listenter
    let rect = this.canvas.getBoundingClientRect();
    let left = rect.left + window.pageXOffset;
    let top = rect.top + window.pageYOffset;
    let isDrawing = false;
    this.canvas.onmousedown = ( e => {
      isDrawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(e.pageX-left, e.pageY-top);
    });
    this.canvas.onmousemove = ( e => {
      if (isDrawing) {
        this.ctx.lineTo(e.pageX-left, e.pageY-top);
        this.ctx.stroke();
      }
    });
    this.canvas.onmouseup = ( e => {
      isDrawing = false;
    });
  }

  toDataURL(...args) {
    return this.canvas.toDataURL(args);
  }

  clean() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
}

export default Sketch
