import React, { useState, useEffect } from "react";

import "./App.css";
import { radioStreams } from "./radioStreams";
import { localGifs } from "./localGifs";
import useControlPlayBack from "./hooks/useControlPlayBack";
import useLocalStorageState from "./hooks/useLocalStorageState";

function App() {
  const [src, setSrc] = useLocalStorageState(
    "src",
    localGifs[Math.ceil(Math.random() * localGifs.length - 1)]
  );
  const [urls, setUrls] = useLocalStorageState("urls", []);
  const [streamLink, setStreamLink] = useLocalStorageState(
    "streamLink",
    radioStreams[0].link
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (urls) {
      setSrc(urls[Math.ceil(Math.random() * 50)]);
    }
  }, [setSrc, urls]);

  useEffect(() => {
    if (urls.length === 0) {
      const getGifSrc = async () => {
        let response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIPHY_API_KEY}&q=synthwave&limit=50&offset=0&rating=G&lang=en`
        );
        let data = await response.json();
        let srcList = data.data;
        let urls = srcList.map((src) => src.images.original.url);
        console.log("api call");
        return urls;
      };
      getGifSrc().then((urls) => {
        setUrls(urls);
      });
    }
  }, [setUrls, urls.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      let randInt = Math.ceil(Math.random() * 50);
      setSrc(urls[randInt]);
      // console.log(urlsRef.current[randInt])
    }, 120000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title =
      "radiowave | " +
      radioStreams.find((stream) => stream.link === streamLink)?.name;
  }, [streamLink]);

  const { audioRef } = useControlPlayBack(setStreamLink, streamLink);

  return (
    <div className="gif" style={{ backgroundImage: `url(${src})` }}>
      <h1>【ｒａｄｉｏｗａｖｅ】</h1>
      <p>A minimal synthwave radio</p>
      <audio
        ref={audioRef}
        controls
        autoPlay
        src={streamLink}
        onLoadStart={() => setIsLoading(true)}
        onLoadedData={() => setIsLoading(false)}
        onError={() => setStreamLink(radioStreams[1].link)}
      ></audio>
      {isLoading && <div className="lds-dual-ring"></div>}

      <div className="stream-btns">
        {radioStreams.map((stream, i) => (
          <button
            key={i}
            className={`btn ${streamLink === stream.link && "active"}`}
            onClick={() => setStreamLink(stream.link)}
          >
            {stream.name}
          </button>
        ))}
      </div>
      <div className="attribution">
        <a href="https://github.com/therexone/radiowave">Github</a>
        <a href="https://giphy.com">Powered by Giphy</a>
      </div>
    </div>
  );
}

export default App;
