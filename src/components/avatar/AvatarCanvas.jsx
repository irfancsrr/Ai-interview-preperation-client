import { useEffect, useRef, useCallback, useState } from 'react';

const COLORS = {
  skin: '#F5D6BA',
  hair: '#4A3728',
  eyes: '#2C3E50',
  mouth: '#C0392B',
  shirt: '#4F46E5',
  bg: '#EEF2FF',
};

export default function AvatarCanvas({ state = 'idle', width = 280, height = 320 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameRef = useRef(0);
  const blinkRef = useRef(0);
  const [isBlinking, setIsBlinking] = useState(false);

  const drawAvatar = useCallback((ctx, frame) => {
    const cx = width / 2;
    const cy = height / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Gentle head bob
    const bobY = Math.sin(frame * 0.03) * 2;
    const bobX = Math.sin(frame * 0.02) * 1;

    const hx = cx + bobX;
    const hy = cy + bobY;

    // Neck
    ctx.fillStyle = COLORS.skin;
    ctx.fillRect(hx - 15, hy + 55, 30, 30);

    // Shirt/body
    ctx.fillStyle = COLORS.shirt;
    ctx.beginPath();
    ctx.ellipse(hx, hy + 110, 70, 45, 0, Math.PI, 0, true);
    ctx.fill();

    // Head
    ctx.fillStyle = COLORS.skin;
    ctx.beginPath();
    ctx.ellipse(hx, hy, 55, 65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = COLORS.hair;
    ctx.beginPath();
    ctx.ellipse(hx, hy - 30, 58, 42, 0, Math.PI, 0);
    ctx.fill();
    // Side hair
    ctx.fillRect(hx - 58, hy - 30, 12, 40);
    ctx.fillRect(hx + 46, hy - 30, 12, 40);

    // Eyes
    const eyeOpenness = isBlinking ? 1 : 8;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(hx - 18, hy - 5, 12, eyeOpenness, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(hx + 18, hy - 5, 12, eyeOpenness, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!isBlinking) {
      // Pupils - slight movement based on state
      const pupilOffset = state === 'listening' ? 2 : 0;
      ctx.fillStyle = COLORS.eyes;
      ctx.beginPath();
      ctx.arc(hx - 18 + pupilOffset, hy - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hx + 18 + pupilOffset, hy - 5, 5, 0, Math.PI * 2);
      ctx.fill();

      // Pupil highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(hx - 16 + pupilOffset, hy - 7, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hx + 20 + pupilOffset, hy - 7, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyebrows
    ctx.strokeStyle = COLORS.hair;
    ctx.lineWidth = 2.5;
    const browLift = state === 'listening' ? -3 : 0;
    ctx.beginPath();
    ctx.moveTo(hx - 28, hy - 18 + browLift);
    ctx.quadraticCurveTo(hx - 18, hy - 24 + browLift, hx - 8, hy - 18 + browLift);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hx + 8, hy - 18 + browLift);
    ctx.quadraticCurveTo(hx + 18, hy - 24 + browLift, hx + 28, hy - 18 + browLift);
    ctx.stroke();

    // Nose
    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx, hy + 2);
    ctx.lineTo(hx - 4, hy + 15);
    ctx.lineTo(hx + 4, hy + 15);
    ctx.stroke();

    // Mouth
    ctx.fillStyle = COLORS.mouth;
    if (state === 'speaking') {
      // Animated mouth - opens and closes
      const mouthOpen = Math.abs(Math.sin(frame * 0.15)) * 8 + 2;
      ctx.beginPath();
      ctx.ellipse(hx, hy + 28, 12, mouthOpen, 0, 0, Math.PI * 2);
      ctx.fill();
      // Teeth
      if (mouthOpen > 4) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(hx - 8, hy + 24, 16, 3);
      }
    } else if (state === 'thinking') {
      // Slight frown / thinking mouth
      ctx.strokeStyle = COLORS.mouth;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(hx - 8, hy + 28);
      ctx.lineTo(hx + 8, hy + 28);
      ctx.stroke();
      // Thinking dots
      const dotPhase = Math.floor(frame / 15) % 4;
      ctx.fillStyle = '#6366F1';
      for (let i = 0; i < 3; i++) {
        const alpha = (dotPhase > i) ? 1 : 0.2;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(hx + 80 + i * 12, hy + 10, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      // Smile
      ctx.strokeStyle = COLORS.mouth;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(hx, hy + 22, 12, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    // Ears
    ctx.fillStyle = COLORS.skin;
    ctx.beginPath();
    ctx.ellipse(hx - 55, hy, 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(hx + 55, hy, 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Status label
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    const labels = { idle: 'Ready', speaking: 'Speaking...', listening: 'Listening...', thinking: 'Thinking...' };
    ctx.fillText(labels[state] || '', cx, height - 15);

  }, [width, height, state, isBlinking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      frameRef.current++;

      // Blink every 3-5 seconds
      blinkRef.current++;
      if (blinkRef.current > 180 + Math.random() * 120) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
        blinkRef.current = 0;
      }

      drawAvatar(ctx, frameRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [drawAvatar]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-xl border-2 border-indigo-200 bg-indigo-50"
    />
  );
}
