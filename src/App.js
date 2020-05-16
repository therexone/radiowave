import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player'
import './App.css';
import { config } from './config';
import { radioStreams } from './radioStreams';

function App() {

  const [src, setSrc] = useState('./static/1.gif')
  const [urls, setUrls] = useState([])
  const [streamLink, setStreamLink] = useState(radioStreams[0].link)

  const urlsRef = useRef();
  urlsRef.current = urls;

  useEffect(() => {
    const urls = JSON.parse(localStorage.getItem('urls'))
    if (urls) {
      setUrls(urls)
      // console.log('got localdata')
    }
  }, [])

  useEffect(() => {
    if (urlsRef.length === 0) {
      const getGifSrc = async () => {
        let response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${config.API_KEY}&q=synthwave&limit=50&offset=0&rating=G&lang=en`)
        let data = await response.json()
        let srcList = data.data
        let urls = srcList.map((src) => src.images.original.url)
        console.log('api call')
        return urls
      }
      getGifSrc().then((urls) => {
        setUrls(urls)
        localStorage.setItem('urls', JSON.stringify(urls))
      });
    }
  }, [urls.length])


  useEffect(() => {
    setInterval(() => {
      let randInt = Math.ceil(Math.random() * 50)
      setSrc(urlsRef.current[randInt])
      console.log(urlsRef.current[randInt])
    }
      , 30000);
  }, [])


  return (
    <div className="gif" style={{ backgroundImage: `url(${src})` }}>
      <h1>【ｒａｄｉｏｗａｖｅ】</h1>
      <ReactPlayer controls={true} id="player" playing url={streamLink} height="40px" width="360px" />
      <div className="stream-btns">
        {radioStreams.map((stream, i) => (
          <button key={i} className={`btn ${streamLink === stream.link && 'active'}`} onClick={() => setStreamLink(stream.link)}>{stream.name}</button>
        ))}

      </div>
    </div>
  );
}

export default App;
