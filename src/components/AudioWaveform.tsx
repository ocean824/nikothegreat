import { useEffect, useRef, useState } from "react";

interface AudioWaveformProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  className?: string;
}

export const AudioWaveform = ({ audioRef, isPlaying, className = "" }: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Draw idle waveform
      drawIdleWaveform();
      return;
    }

    // Create or reuse audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;

    // Only create source once per audio element
    if (!isConnected) {
      try {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        sourceRef.current = audioContext.createMediaElementSource(audio);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);
        setIsConnected(true);
      } catch (e) {
        // Source might already be connected
        console.log("Audio already connected");
      }
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvasRef.current || !analyser) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = 40;
      const barWidth = width / barCount - 2;
      const gap = 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex];
        const barHeight = Math.max(4, (value / 255) * height * 0.9);

        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        // Gradient from primary color
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, "hsl(142, 76%, 45%)");
        gradient.addColorStop(0.5, "hsl(142, 76%, 36%)");
        gradient.addColorStop(1, "hsl(142, 76%, 45%)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioRef, isPlaying, isConnected]);

  const drawIdleWaveform = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const barCount = 40;
    const barWidth = width / barCount - 2;
    const gap = 2;

    for (let i = 0; i < barCount; i++) {
      // Create a subtle wave pattern for idle state
      const barHeight = 4 + Math.sin(i * 0.3) * 2;

      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      ctx.fillStyle = "hsl(142, 40%, 30%)";
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }
  };

  // Draw idle waveform on mount
  useEffect(() => {
    drawIdleWaveform();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={40}
      className={`${className}`}
    />
  );
};
