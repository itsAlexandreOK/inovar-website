import { SVGProps } from "react";
import React, { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const musicStateVariants = {
  play: (
    <FaPlay color="black" size={20} className="mr-6"/>
  ),
  pause: (
    <FaPause color="black" size={20} className="mr-6"/>
  ),
};

const audioPlayer = document.createElement('audio');
const radioURL = "https://sv10.hdradios.net:7484/stream"
const audio = audioPlayer;;
audio.src = radioURL;
audio.preload = 'auto';
audio.volume = 0.5;
audio.crossOrigin = "anonymous";

export function PauseAndPlayIcon(props: SVGProps<SVGSVGElement>) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  return (
    <div onClick={togglePlayPause} style={{ cursor: 'pointer' }}>
      {isPlaying ? musicStateVariants.pause : musicStateVariants.play}
    </div>
  )
}