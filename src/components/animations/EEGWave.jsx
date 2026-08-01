import { useEffect, useRef } from 'react';
import { neuroColors } from '@/utils/colors';

export default function EEGWave({ channel = 'F3', className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    let offset = 0;
    let animFrameId;

    function drawWave() {
      ctx.clearRect(0, 0, width, height);
      
      ctx.beginPath();
      ctx.strokeStyle = neuroColors.electricBlue;
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x++) {
        const y = height / 2 + 
          Math.sin((x + offset) * 0.02) * 20 +
          Math.sin((x + offset) * 0.05) * 10 +
          Math.random() * 5;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      offset += 2;

      animFrameId = requestAnimationFrame(drawWave);
    }

    drawWave();

    const ro = new ResizeObserver(() => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animFrameId);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-2 left-2 text-xs font-mono text-cyan-400">
        {channel}
      </div>
    </div>
  );
}