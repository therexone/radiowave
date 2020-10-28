import React, { useState, useEffect } from "react";

import "./App.css";
import { radioStreams } from "./radioStreams";
import visualizer from "./visualizer";

function App() {
  const [streamLink, setStreamLink] = useState(radioStreams[0].link);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    visualizer();
  }, []);

  useEffect(() => {
    const streamLink = JSON.parse(localStorage.getItem("streamLink"));
    if (streamLink) {
      setStreamLink(streamLink);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("streamLink", JSON.stringify(streamLink));
  }, [streamLink]);

  return (
    <>
      <div className="gif">
        <h1>【ｒａｄｉｏｗａｖｅ】</h1>
        <p>A minimal synthwave radio</p>
        <audio
          controls
          autoPlay
          onLoadStart={() => setIsLoading(true)}
          onLoadedData={() => setIsLoading(false)}
          onError={() => setStreamLink(radioStreams[1].link)}
          src={streamLink}
          id="audio"
        />

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
      </div>
      {isLoading && <div className="lds-dual-ring"></div>}
    </>
  );
}

export default App;
