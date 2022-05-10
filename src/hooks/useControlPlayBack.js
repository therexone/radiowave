import { useEffect, useRef } from "react";
import { radioStreams } from "../radioStreams";
import useLocalStorageState from "./useLocalStorageState";

const useControlPlayBack = (setStreamLink, streamLink) => {
  const [volume, setVolume] = useLocalStorageState("volume", 1);

  const audioRef = useRef();

  useEffect(() => {
    const audio = audioRef.current;
    if (volume) {
      audio.volume = volume;
    }
    const saveVolumeToState = () => {
      setVolume(audio.volume);
    };
    audio.addEventListener("volumechange", saveVolumeToState);

    return () => {
      audio.removeEventListener("volumechange", saveVolumeToState);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const adjustVolumeOnScroll = (e) => {
      if (e.wheelDelta < 0) {
        audio.volume = Math.max(0, audio.volume - 0.05);
      }
      if (e.wheelDelta > 0) {
        audio.volume = Math.min(1, audio.volume + 0.05);
      }
    };

    const toggleMute = (e) => {
      if (e.keyCode === 109) {
        audio.muted = !audio.muted;
      }
    };

    const adjustVolumeOnKeyPress = (e) => {
      if (e.keyCode === 40) {
        audio.volume = Math.max(0, audio.volume - 0.1);
      }
      if (e.keyCode === 38) {
        audio.volume = Math.min(1, audio.volume + 0.1);
      }
    };

    document.addEventListener("keypress", toggleMute);
    document.addEventListener("keydown", adjustVolumeOnKeyPress);

    window.addEventListener("wheel", adjustVolumeOnScroll);

    return () => {
      window.removeEventListener("wheel", adjustVolumeOnScroll);
      document.removeEventListener("keypress", toggleMute);
      document.removeEventListener("keydown", adjustVolumeOnKeyPress);
    };
  }, []);

  useEffect(() => {
    const updateStream = (e) => {
      if (e.keyCode === 32) {
        const currentIndex = radioStreams.findIndex(
          (stream) => stream.link === streamLink
        );

        const nextIndex = (currentIndex + 1) % radioStreams.length;

        setStreamLink(radioStreams[nextIndex].link);
      }
    };

    document.addEventListener("keypress", updateStream);

    return () => {
      document.removeEventListener("keypress", updateStream);
    };
  }, [setStreamLink, streamLink]);

  useEffect(() => {}, []);

  return { audioRef };
};

export default useControlPlayBack;
