import React, { useState, useEffect, useRef } from "react";

import "./App.css";
import { radioStreams } from "./radioStreams";
import { localGifs } from "./localGifs";

function App() {
  const [src, setSrc] = useState(
    localGifs[Math.ceil(Math.random() * localGifs.length)]
  );
  const [urls, setUrls] = useState([]);
  const [streamLink, setStreamLink] = useState(radioStreams[0].link);
  const [isLoading, setIsLoading] = useState(true);

  const urlsRef = useRef();
  urlsRef.current = urls;

  useEffect(() => {
    const urls = JSON.parse(localStorage.getItem("urls"));
    if (urls) {
      setUrls(urls);
      urlsRef.current = urls;
      setSrc(urls[Math.ceil(Math.random() * 50)]);
      // console.log('urls local found and set')
    }
  }, []);

  useEffect(() => {
    const streamLink = JSON.parse(localStorage.getItem("streamLink"));
    if (streamLink) {
      setStreamLink(streamLink);
    }
  }, []);

  useEffect(() => {
    // console.log(urlsRef.current.length)
    if (urlsRef.current.length === 0) {
      const getGifSrc = async () => {
        let response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=synthwave&limit=50&offset=0&rating=G&lang=en`
        );
        let data = await response.json();
        let srcList = data.data;
        let urls = srcList.map((src) => src.images.original.url);
        // console.log('api call')
        return urls;
      };
      getGifSrc().then((urls) => {
        setUrls(urls);
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("urls", JSON.stringify(urls));
  }, [urls]);

  useEffect(() => {
    localStorage.setItem("streamLink", JSON.stringify(streamLink));
  }, [streamLink]);

  useEffect(() => {
    setInterval(() => {
      let randInt = Math.ceil(Math.random() * 50);
      setSrc(urlsRef.current[randInt]);
      // console.log(urlsRef.current[randInt])
    }, 120000);
  }, []);

  return (
    <div className="gif" style={{ backgroundImage: `url(${src})` }}>
      <h1>【ｒａｄｉｏｗａｖｅ】</h1>
      <p>A minimal synthwave radio</p>
      <audio
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
