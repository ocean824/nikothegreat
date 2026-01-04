import { useEffect, useRef, useState } from "react";

interface AudioWaveformProps {
  audioSrc: string;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  className?: string;
}

export const AudioWaveform = ({ audioSrc, isPlaying, audioRef, className = "" }: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Analyze audio file and extract waveform data
  useEffect(() => {
    const analyzeAudio = async () => {
      try {
        const response = await fetch(audioSrc);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get the audio data from the first channel
        const rawData = audioBuffer.getChannelData(0);
        const samples = 60; // Number of bars to display
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData: number[] = [];

        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[i * blockSize + j]);
          }
          filteredData.push(sum / blockSize);
        }

        // Normalize the data
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

    const width = canvas.width;
    const height = canvas.height;
    const barCount = waveformData.length;
    const barWidth = (width / barCount) - 1.5;
    const gap = 1.5;

    ctx.clearRect(0, 0, width, height);

    waveformData.forEach((value, i) => {
      const barHeight = Math.max(4, value * height * 0.85);
      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      // Calculate if this bar is before or after the playhead
      const barProgress = i / barCount;
      const isPast = barProgress <= progress;

      ctx.fillStyle = isPast 
        ? "hsl(142, 76%, 42%)" // Primary green for played portion
        : "hsl(142, 30%, 25%)"; // Muted green for unplayed

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 1.5);
      ctx.fill();
    });
  }, [waveformData, progress]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={36}
      className={className}
    />
  );
};
