import { BLUR_RADIUS, DOT_COLOR, MAX_AREA, MIN_OPACITY } from "./constants";
import { sizeRatio, sizeRatio2Radius } from "./misc";
import style from "./style.css";
import { useEffect, useRef, useState } from "preact/hooks";

function polygonArea(vertices) {
  if (vertices.length < 3) return 0;
  let area = 0;
  let [x0, y0] = vertices[0];
  for (let [x, y] of vertices.slice(1).concat([vertices[0]])) {
    area += x * y0 - y * x0;
    [x0, y0] = [x, y];
  }
  return Math.abs(area); // scaled because way too big otherwise
}

function opacity(n, vertices) {
  // n : 0 -> 100
  let area = polygonArea(vertices);
  if (area > MAX_AREA) area = MAX_AREA;
  return (
    MIN_OPACITY + (1 - MIN_OPACITY) * Math.max(0, n / 100 - area / MAX_AREA)
  );
}

export default function GraphInputDisplay({ points, size }) {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    if (canvasRef.current != null) {
      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx != null) {
        setCtx(renderCtx);
      }
    }
  }, [ctx]);

  const ratio = sizeRatio(size);
  const blur = 0.5 * ratio * BLUR_RADIUS;
  const radius = sizeRatio2Radius(ratio);
  const fillShape = points.length > 2;

  if (ctx != null) {
    ctx.canvas.width = document.body.scrollWidth;
    ctx.canvas.height = document.body.scrollHeight;
    ctx.fillStyle = DOT_COLOR;
    // ctx.filter = `blur(${blur}px)`;

    // the actual shapes
    if (!fillShape) {
      points.forEach(point => {
        ctx.beginPath();
        const cx = point[0];
        const cy = point[1];
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      ctx.lineWidth = radius * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const startPt = points[0];
      ctx.beginPath();
      ctx.moveTo(startPt[0], startPt[1]);
      points.slice(1).forEach(point => ctx.lineTo(point[0], point[1]));
      ctx.lineTo(startPt[0], startPt[1]);
      ctx.fill();
      ctx.stroke();
    }
  }

  return (
    <canvas
      ref={canvasRef}
      class={style.canvasGraphInputDisplay}
      style={{
        opacity: opacity(size, points),
        webkitFilter: `blur(${blur}px)`,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}
