import React, { useEffect, useRef, useCallback } from 'react';
import { WheelOption, WheelConfig, Language } from '../types';
import { getContrastTextColor, getSliceColors } from '../utils/colorThemes';
import { sound } from '../utils/sound';
import { Play, Sparkles, Download } from 'lucide-react';
import { t } from '../utils/translations';

interface SpinWheelProps {
  options: WheelOption[];
  config: WheelConfig;
  onSpinStart?: () => void;
  onSpinEnd: (winner: WheelOption) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  lang: Language;
  spinTrigger?: number;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
  options,
  config,
  onSpinStart,
  onSpinEnd,
  isSpinning,
  setIsSpinning,
  lang,
  spinTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Current angle in radians
  const currentAngleRef = useRef<number>(0);
  const lastTickIndexRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);

  const activeOptions = options.filter((opt) => !opt.hidden);

  // Draw the wheel onto the canvas
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    // Reset and set clean transform matrix matching device pixel ratio
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(10, Math.min(centerX, centerY) - 22); // Margin for border & ticker

    ctx.clearRect(0, 0, width, height);

    if (activeOptions.length === 0) {
      // Empty wheel state
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 18px "Plus Jakarta Sans", Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        lang === 'ar' ? 'أضف خيارات للتدوير' : 'Add options to spin',
        centerX,
        centerY
      );
      return;
    }

    const numSlices = activeOptions.length;
    const sliceAngle = (Math.PI * 2) / numSlices;
    const themeColors = getSliceColors(numSlices, config.themeId);

    // 1. Draw Outer Decorative Bezel Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 14, 0, Math.PI * 2);
    const bgGrad = ctx.createRadialGradient(
      centerX,
      centerY,
      radius,
      centerX,
      centerY,
      radius + 18
    );
    bgGrad.addColorStop(0, '#334155');
    bgGrad.addColorStop(0.5, '#0F172A');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Metallic Rim Accent
    ctx.lineWidth = 4;
    ctx.strokeStyle = config.customPointerColor || '#F59E0B';
    ctx.stroke();

    // Rivets / LED Dots around the rim
    const totalDots = Math.max(12, numSlices * 2);
    for (let i = 0; i < totalDots; i++) {
      const dotAngle = (i * Math.PI * 2) / totalDots;
      const dotX = centerX + Math.cos(dotAngle) * (radius + 7);
      const dotY = centerY + Math.sin(dotAngle) * (radius + 7);

      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#F59E0B' : '#F1F5F9';
      ctx.fill();
    }
    ctx.restore();

    // 2. Draw Wheel Slices
    const rotationOffset = currentAngleRef.current;

    activeOptions.forEach((option, i) => {
      const startAngle = i * sliceAngle + rotationOffset;
      const endAngle = startAngle + sliceAngle;
      const sliceColor = option.color || themeColors[i % themeColors.length];

      // Slice sector
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = sliceColor;
      ctx.fill();

      // Divider line
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0F172A';
      ctx.stroke();

      // 3. Draw Text in Slice
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);

      const textColor = getContrastTextColor(sliceColor);
      ctx.fillStyle = textColor;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Font size scales dynamically with canvas size & slice count
      const scaleFactor = radius / 220;
      const baseFontSize = Math.max(11, Math.min(22, Math.floor(210 / Math.sqrt(numSlices))));
      const fontSize = Math.max(10, Math.round(baseFontSize * scaleFactor));
      
      const fontFam = lang === 'ar' ? 'Cairo, sans-serif' : '"Plus Jakarta Sans", sans-serif';
      ctx.font = `bold ${fontSize}px ${fontFam}`;

      // Truncate text if too long
      const maxTextWidth = radius * 0.65;
      let text = option.label;
      if (ctx.measureText(text).width > maxTextWidth) {
        while (text.length > 3 && ctx.measureText(text + '...').width > maxTextWidth) {
          text = text.slice(0, -1);
        }
        text += '...';
      }

      ctx.fillText(text, radius - 18 * scaleFactor, 0);
      ctx.restore();
    });

    // 4. Draw Center Spin Cap
    const capRadius = Math.max(26, Math.min(38, radius * 0.18));
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, capRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, capRadius * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#1E293B';
    ctx.fill();

    ctx.fillStyle = '#F8FAFC';
    const capFontSize = Math.max(10, Math.round(13 * (capRadius / 38)));
    ctx.font = `bold ${capFontSize}px "Plus Jakarta Sans", Cairo, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(lang === 'ar' ? 'تدوير' : 'SPIN', centerX, centerY);
    ctx.restore();

    // 5. Draw Top Ticker Pointer
    ctx.save();
    const pointerWidth = Math.max(20, Math.min(26, radius * 0.12));
    const pointerHeight = Math.max(28, Math.min(36, radius * 0.16));
    const pointerX = centerX;
    const pointerY = centerY - radius - 8;

    // Outer Glow / Shadow
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(pointerX - pointerWidth / 2, pointerY - pointerHeight);
    ctx.lineTo(pointerX + pointerWidth / 2, pointerY - pointerHeight);
    ctx.lineTo(pointerX, pointerY + 6); // Pointing down onto the wheel
    ctx.closePath();

    ctx.fillStyle = config.customPointerColor || '#F59E0B';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Pointer rivet
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(pointerX, pointerY - pointerHeight + 8, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();

    ctx.restore();
  }, [activeOptions, config, lang]);

  // Canvas auto-resizing to handle all device widths
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      // Fit container nicely on mobile screens down to 260px
      const availableWidth = container.clientWidth - 16;
      const size = Math.max(240, Math.min(availableWidth, 500));
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      drawWheel();
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [drawWheel]);

  // Initial draw
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Spin Logic with Realistic Physics Easing
  const spin = () => {
    if (isSpinning || activeOptions.length === 0) return;

    if (onSpinStart) onSpinStart();
    setIsSpinning(true);
    sound.playClick(config.volume);

    const duration = config.spinDuration * 1000; // in ms
    const startTime = performance.now();
    const numSlices = activeOptions.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    // Minimum full rotations (between 5 and 9)
    const extraRotations = 5 + Math.random() * 4;
    const randomTargetIndex = Math.floor(Math.random() * numSlices);

    // Target angle where randomTargetIndex ends up aligned under the top pointer
    const targetOffset = (3 * Math.PI) / 2 - (randomTargetIndex + 0.5) * sliceAngle;
    const startAngle = currentAngleRef.current % (Math.PI * 2);
    const totalRotationAngle = extraRotations * Math.PI * 2 + targetOffset - startAngle;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quartic Ease-Out curve for deceleration physics
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentAngle = startAngle + totalRotationAngle * easeOut;
      currentAngleRef.current = currentAngle;

      // Tick sound detection when slice boundary crosses pointer
      if (config.soundEnabled) {
        const pointerAngle = (3 * Math.PI) / 2;
        const normalizedAngle = (pointerAngle - (currentAngle % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2);
        const currentSliceIndex = Math.floor(normalizedAngle / sliceAngle) % numSlices;

        if (currentSliceIndex !== lastTickIndexRef.current) {
          lastTickIndexRef.current = currentSliceIndex;
          const speedFactor = 1 - easeOut; // pitch/vol slows down with wheel
          sound.playTick(config.volume, 0.8 + speedFactor * 0.5);
        }
      }

      drawWheel();

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        setIsSpinning(false);

        // Final winner index verification
        const pointerAngle = (3 * Math.PI) / 2;
        const finalNormalizedAngle = (pointerAngle - (currentAngleRef.current % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2);
        const winnerIndex = Math.floor(finalNormalizedAngle / sliceAngle) % numSlices;
        const winner = activeOptions[winnerIndex] || activeOptions[0];

        if (config.soundEnabled) {
          sound.playVictory(config.volume);
        }

        onSpinEnd(winner);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Trigger spin externally (e.g. from Winner Modal 'Spin Again' button)
  useEffect(() => {
    if (spinTrigger && spinTrigger > 0 && !isSpinning && activeOptions.length > 0) {
      spin();
    }
  }, [spinTrigger]);

  const handleDownloadImage = () => {
    const sourceCanvas = canvasRef.current;
    if (!sourceCanvas) return;

    const exportCanvas = document.createElement('canvas');
    const size = 1000;
    exportCanvas.width = size;
    exportCanvas.height = size + 120;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Dark background
    ctx.fillStyle = config.customBgColor || '#0f172a';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Subtle glow
    const glow = ctx.createRadialGradient(size / 2, size / 2 + 30, 100, size / 2, size / 2 + 30, size / 2 + 50);
    glow.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
    glow.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Optional Title Header
    if (config.title) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(config.title, size / 2, 60);
    }

    // Draw Source Canvas Wheel Centered
    const wheelMargin = 70;
    const wheelSize = size - wheelMargin * 2;
    const wheelY = config.title ? 95 : 60;
    ctx.drawImage(sourceCanvas, wheelMargin, wheelY, wheelSize, wheelSize);

    // Watermark
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RandomizerWheel.com', size / 2, exportCanvas.height - 35);

    // Download PNG
    const link = document.createElement('a');
    const cleanTitle = config.title ? config.title.replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_') : 'wheel';
    link.download = `${cleanTitle}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full py-1 sm:py-2">
      {/* Canvas Wrapper */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center p-2 rounded-full shadow-2xl bg-slate-900/80 border border-slate-700/60 transition-transform w-full max-w-[500px] aspect-square overflow-hidden mx-auto"
      >
        <canvas
          ref={canvasRef}
          onClick={spin}
          className={`cursor-pointer touch-manipulation select-none transition-transform ${
            isSpinning ? 'pointer-events-none' : 'hover:scale-[1.01] active:scale-[0.99]'
          }`}
        />
      </div>

      {/* Control Buttons Container */}
      <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md px-2">
        {/* Main Spin CTA Button */}
        <button
          id="btn-spin-main"
          onClick={spin}
          disabled={isSpinning || activeOptions.length === 0}
          className={`w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 text-lg sm:text-xl font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-300 transform ${
            isSpinning || activeOptions.length === 0
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-70'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 hover:scale-105 active:scale-95 shadow-amber-500/25 ring-4 ring-amber-400/20'
          }`}
        >
          {isSpinning ? (
            <>
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>{t(lang, 'spinning')}</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950" />
              <span>{t(lang, 'clickToSpin')}</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
            </>
          )}
        </button>

        {/* Download Image Button */}
        <button
          onClick={handleDownloadImage}
          disabled={isSpinning || activeOptions.length === 0}
          title={t(lang, 'downloadImage')}
          className="w-full sm:w-auto px-4 py-3.5 sm:py-4 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-amber-400 rounded-2xl text-sm font-bold border border-slate-700/80 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Download className="w-5 h-5 text-amber-400" />
          <span className="inline">{t(lang, 'downloadImage')}</span>
        </button>
      </div>

      {/* Instructions pill */}
      <p className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs text-slate-400 text-center px-2">
        {lang === 'ar'
          ? 'انقر على الزر أو على منتصف العجلة للبدء'
          : 'Click the button or tap center of the wheel to spin'}
      </p>
    </div>
  );
};
