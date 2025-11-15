const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("no canvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("no context");

const measures = canvas.getBoundingClientRect();
canvas.width = measures.width;
canvas.height = measures.height;

/** @type{Map<number, {x: number, y:number}>} */
const touches = new Map();

const timer = 10; // seconds
let timeZero = performance.now();
const fingerSize = 50;

/**
 *
 * @param {TouchEvent} e
 */
function handler(e) {
  e.preventDefault();
  const count = touches.size;
  touches.clear();
  for (const touch of e.touches) {
    touches.set(touch.identifier, {
      x: touch.clientX,
      y: touch.clientY,
    });
  }
  if (count != touches.size) {
    timeZero = performance.now();
  }
}

canvas.addEventListener("touchstart", handler);
canvas.addEventListener("touchmove", handler);
canvas.addEventListener("touchend", handler);

const mapTime = mapping(-1, 1, 1, 1.5);

requestAnimationFrame(function draw(time) {
  // reset canvas
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // timer
  const elapsed = performance.now() - timeZero;
  const secs = Math.round(elapsed / 1000);
  const timeRemaining = timer - secs;

  // Draw time remaining
  ctx.fillStyle = "#FFFF00";
  ctx.font = "26px Arial";
  ctx.fillText(timeRemaining.toString(), 20, 50);

  drawFingers(time);
  requestAnimationFrame(draw);
});

/**
 *
 * @param {number} time
 */
const drawFingers = (time) => {
  for (const touch of touches.values()) {
    ctx.beginPath();
    ctx.fillStyle = "#07420dff";
    const step = mapTime(Math.sin(time / 250));
    const size = fingerSize * step;
    ctx.ellipse(touch.x, touch.y, size, size, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
};

/**
 *
 * @param {number} fromMin
 * @param {number} fromMax
 * @param {number} toMin
 * @param {number} toMax
 * @returns {(value: number) => number}
 */
function mapping(fromMin, fromMax, toMin, toMax) {
  const fromRange = fromMax - fromMin;
  const toRange = toMax - toMin;
  return function (value) {
    const ratio = (value - fromMin) / fromRange;
    return ratio * toRange + toMin;
  };
}
