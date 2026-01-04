import { useEffect, useRef, useState } from "react";

interface AudioWaveformProps {
  audioSrc: string;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export const AudioWaveform = ({ audioSrc, isPlaying, audioRef }: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 300, height: 40 });
  const animationRef = useRef<number | null>(null);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width * 2, height: 80 }); // 2x for retina
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Analyze audio file and extract waveform data
  useEffect(() => {
    const analyzeAudio = async () => {
      try {
        const response = await fetch(audioSrc);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const rawData = audioBuffer.getChannelData(0);
        const samples = 80;
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData: number[] = [];

        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[i * blockSize + j]);
          }
          filteredData.push(sum / blockSize);
        }

        const maxVal = Math.max(...filteredData);
        const normalized = filteredData.map(val => val / maxVal);
        setWaveformData(normalized);
        
        audioContext.close();
      } catch (error) {
        console.error("Error analyzing audio:", error);
      }
    };

    if (audioSrc) {
      analyzeAudio();
    }
  }, [audioSrc]);

  // Track playback progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      updateProgress();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, audioRef]);

  // Draw the waveform
  useEffect(() => {
    if (!canvasRef.current || waveformData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = dimensions.width;
    const height = dimensions.height;
    const barCount = waveformData.length;
    const barWidth = (width / barCount) - 2;
    const gap = 2;

    ctx.clearRect(0, 0, width, height);

    waveformData.forEach((value, i) => {
      const barHeight = Math.max(6, value * height * 0.85);
      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      const barProgress = i / barCount;
      const isPast = barProgress <= progress;

      ctx.fillStyle = isPast 
        ? "hsl(142, 76%, 42%)"
        : "hsl(142, 30%, 25%)";

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    });
  }, [waveformData, progress, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-10">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
};
