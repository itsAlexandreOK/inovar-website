import { SVGProps } from "react";
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const musicStateVariants = {
  play: (
    <FaPlay color="black" size={20} className="mr-6"/>
  ),
  pause: (
    <FaPause color="black" size={20} className="mr-6"/>
  ),
};

const radioURL = "https://sv10.hdradios.net:7484/stream";

export function PauseAndPlayIcon(props: SVGProps<SVGSVGElement>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element only on client side
    if (typeof window !== 'undefined') {
      const audio = new Audio(radioURL);
      audio.preload = 'auto';
      audio.volume = 0.5;
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;
    }

    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div onClick={togglePlayPause} style={{ cursor: 'pointer' }}>
      {isPlaying ? musicStateVariants.pause : musicStateVariants.play}
    </div>
  )
}