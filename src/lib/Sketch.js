import d3 from 'd3'

class Sketch {
  constructor(canvas) {
    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext('2d');

    //add event listenter
    let rect = this.canvas.getBoundingClientRect();
    let left = rect.left + window.pageXOffset;
    let top = rect.top + window.pageYOffset;
    let isDrawing = false;

    let drag = d3.behavior.drag()
      .on("dragstart", () => {
        d3.event.sourceEvent.stopPropagation();
        isDrawing = true;
        this.ctx.beginPath();
      })
      .on("drag", () => {
        if (isDrawing) {
          this.ctx.lineTo(d3.event.x-left, d3.event.y-top);
          this.ctx.stroke();
        }
      })
      .on('dragend', () => {
        isDrawing = false;
      });
    d3.select(this.canvas).call(drag);
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
