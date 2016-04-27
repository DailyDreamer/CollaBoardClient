import Hammer from 'hammerjs'

class Sketch {
  constructor(canvas) {
    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext('2d');

    //add event listenter
    let rect = this.canvas.getBoundingClientRect();
    let left = rect.left + window.pageXOffset;
    let top = rect.top + window.pageYOffset;
    let isDrawing = false;

    let mcContainer = this.canvas;
    let mc = new Hammer.Manager(mcContainer);
    mc.add(new Hammer.Pan());
    mc.on('panstart', (e) => {
      if (e.target !== mcContainer) return;
      isDrawing = true;
      this.ctx.beginPath();
    });
    mc.on('panmove', (e) => {
      if (e.target !== mcContainer) return;
      if (isDrawing) {
        this.ctx.lineTo(e.center.x-left, e.center.y-top);
        this.ctx.stroke();
      }
    });
    mc.on('panend', (e) => {
      if (e.target !== mcContainer) return;
      isDrawing = false;
    });
  }

  toDataURL(...args) {
    return this.canvas.toDataURL(...args);
  }

  drawImage(...args) {
    return this.ctx.drawImage(...args);
  }

  clean() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
}

export default Sketch
