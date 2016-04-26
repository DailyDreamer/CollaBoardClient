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

    let hammertime = new Hammer(this.canvas);
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.on('panstart', () => {
      isDrawing = true;
      this.ctx.beginPath();
    });
    hammertime.on('panmove', (e) => {
      if (isDrawing) {
        this.ctx.lineTo(e.center.x-left, e.center.y-top);
        this.ctx.stroke();
      }
    });
    hammertime.on('panend', () => {
      isDrawing = false;
    });
  }

  toDataURL(...args) {
    return this.canvas.toDataURL(args);
  }

  drawImage(...args) {
    return this.ctx.drawImage(args);
  }

  clean() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
}

export default Sketch
